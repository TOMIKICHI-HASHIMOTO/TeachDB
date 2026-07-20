# HumanMemoryLayer V3 基本設計書

**ドキュメント種別**: 基本設計書
**対象読者**: 実装チーム（第三者実装を前提とする）
**位置づけ**: 合意済み設計思想の正式文書化（新規アーキテクチャ提案を含まない）
**版**: 1.0

---

## 本書の約束事

- 本書は既に合意された HumanMemoryLayer V3 の設計を文書化するものであり、新しい設計を提案しない。
- 設計変更が必要と思われる論点は、本文に混ぜず「検討事項」または第17章「PoCで確定する項目」へ分離する。
- 記述は二種類の記法で区別する。
  - **【決定事項】** — 合意済みで、実装が前提としてよい事項。
  - **【PoC評価】** — PoC の実測を経て確定する事項。実装時は暫定値・暫定方針として扱う。
- 評価軸を混同しない。各要素が「正答率で評価される」のか「スケール・コスト・運用性で評価される」のかを明示する。

---

## 目次

1. システム概要
2. 設計理念
3. 用語定義
4. 全体アーキテクチャ
5. Compile World
6. Runtime World
7. Runtime Assets
8. Asset Pipeline
9. Analyzer
10. Provider
11. Runtime
12. Policy
13. データフロー
14. コンポーネント責務一覧
15. 拡張方針
16. PoC方針
17. PoCで確定する項目（未確定事項）

---

## 1. システム概要

### 1.1 目的

HumanMemoryLayer V3（以下 V3）は、作品本文（Original）を Runtime が利用可能な形式（Runtime Assets）へ変換し、その Runtime Assets のみを根拠として質問応答を行うシステムである。

### 1.2 一文定義

> V3 とは、**Original を Runtime が利用可能な Runtime Assets へ変換し、Runtime Assets のみを根拠に質問へ応答するシステム**である。

### 1.3 本設計の到達目標

本設計の目標は次の一文に集約される。

> **スケール可能な構造を維持しながら、高い正答率を実現すること。**

アーキテクチャは目的ではなく手段である。ただし後述の通り、アーキテクチャの各要素は「正答率に効く要素」と「スケーラビリティ・コスト・運用性に効く要素」に分かれ、両者は異なる評価軸で扱う。

### 1.4 V2 からの本質的転換

V2 では LLM が生成した Memory が唯一の根拠（Source of Truth）を兼ねていた。Memory が破損・陳腐化すると根拠そのものが失われ、Memory 構造の変更が生成器全体へ波及した。

V3 では Source of Truth を Original に固定する。LLM が生成する派生情報（Derived）は Original に対する二次的なキャッシュにすぎず、いつ破棄しても Original から再生成できる。「生成物が根拠か、根拠のキャッシュか」——この一点が V2 と V3 の本質的な差である。

---

## 2. 設計理念

### 2.1 評価軸の二分（本設計の中核方針）

V3 のアーキテクチャ要素は、単一の物差しで測らない。要素ごとに正しい物差しを当てる。

| 評価軸 | 対象要素 | 判定基準 |
|--------|----------|----------|
| **正答率** | Analyzer、Index 設計、Provider、Derived 品質 | 質問に正しく答えられるか |
| **スケール・コスト・運用性** | Compile / Runtime 分離、Mechanism / Policy 分離 | 作品数・質問数が増えても、コスト・レイテンシを一定に保てるか。運用方式を差し替えられるか |

**重要**: Compile/Runtime 分離および Mechanism/Policy 分離は正答率には寄与しない。しかしこれは「無価値な美しさ」ではなく、「正答率以外（スケール・コスト・運用）に寄与する」ことを意味する。正答率で測ると価値が見えないため、必ずスケール・コスト・運用性の軸で評価する。

### 2.2 なぜスケールを制約に含めるか

裸の正答率のみを追うと、最速の勝ち筋は「質問ごとに Original 全文を LLM へ投入する」になる。少数の質問・単一作品では高正答率が出るが、作品が長大化・多数化するとコンテキスト超過とコスト爆発で破綻する。これは V2 の「事前に全 Memory 生成」の裏返しにすぎない。

したがって本設計が守る正答率は、裸の正答率ではなく、次の制約下の正答率である。

> **一定のコスト・レイテンシ制約の下で、作品数と質問数がスケールしても維持される正答率。**

Index が存在するのは全文を毎回投入できないためであり、Compile/Runtime 分離が存在するのは作品が増えても実行時コストを一定に保つためである。これらはスケール時の正答率を守る仕組みである。

### 2.3 三つの分離

V3 は互いに直交する三つの分離の上に成り立つ。いずれか一つを緩めると他が崩れる。

1. **Source of Truth の固定** — Original のみが根拠。Index も Derived もその派生。
2. **Compile / Runtime 分離** — 生成の世界と実行の世界を分ける。Runtime は Original を知らない。
3. **Mechanism / Policy 分離** — 「何を作るか」（Asset Pipeline）と「いつ作るか」（Policy）を分ける。

---

## 3. 用語定義

| 用語 | 定義 |
|------|------|
| **Original** | 作品本文。唯一の Source of Truth。永続データであり、編集・更新・意味付けを行わない。Runtime から直接参照されない。 |
| **Runtime Assets** | Original から変換・生成された、Runtime が利用可能なデータ群。Index と Derived の総称。Compile World と Runtime World の唯一の受け渡し面。再生成可能。 |
| **Index** | Original を決定論的に変換した、情報を保存・検索するための表現。情報を追加せず表現のみを変換する。Original から損失なく再生成可能。生成工程を Compile と呼ぶ。 |
| **Derived** | Original を基に LLM が生成する二次成果物。新しい意味を含み、非決定論的。Source of Truth ではなくキャッシュとして扱う。生成工程を Generate と呼ぶ。 |
| **Asset Pipeline** | Runtime Assets を生成する機構（Mechanism）。「何を生成するか」のみを担当し、「いつ生成するか」は担当しない。 |
| **Index Compiler** | Asset Pipeline の構成要素。Index を決定論的に生成する。 |
| **Derived Generator** | Asset Pipeline の構成要素。LLM を用いて Derived を生成する。 |
| **Compile** | Original の情報を、意味を保存したまま別表現へ変換すること。決定論的。 |
| **Generate** | Original に存在しない新しい意味を付加して情報を生成すること。非決定論的。 |
| **Analyzer** | 質問を解析し、応答に必要な Asset の種別（Asset Request）を決定する Runtime コンポーネント。 |
| **Asset Request** | Analyzer の出力。intent と required_assets（必要な Runtime Asset の種別リスト）を含む。 |
| **Provider** | Asset Request を受け、Runtime Assets を読み取って Context を構築する Runtime コンポーネント。読み取り専用。 |
| **Context** | Provider が Runtime Assets から構築した、LLM へ渡す入力。 |
| **Policy** | Asset Pipeline の起動契機を管理する仲介概念。Runtime の miss を受け取り、方針に従い Pipeline を起動するか否かを決める。Lazy / Eager 等の生成契機を決定する。 |
| **Compile World** | Original から Runtime Assets を生成する世界。 |
| **Runtime World** | Runtime Assets を用いて質問に応答する世界。 |
| **miss** | Provider が要求された Runtime Asset を発見できなかった状態。 |
| **Provenance（来歴）** | Derived に付随する生成メタデータ（元 Original 版、生成モデル、プロンプト版、生成日時等）。 |

---

## 4. 全体アーキテクチャ

### 4.1 二つの世界と受け渡し面

V3 は相互に直接依存しない二つの世界に分離される。両者が共有するのは Runtime Assets という受け渡し面のみである。

```
── Compile World（生成側 / いつ走るかは Policy が決める） ──

    Original
       │
       ▼
   Asset Pipeline
       ├── Index Compiler      （決定論的変換 = Compile）
       └── Derived Generator    （非決定論的生成 = Generate）
       │
       ▼
   Runtime Assets  ◀━━━━━━━━━━━━━━━━━┓
                                     ┃（唯一の受け渡し面）
── Runtime World（実行側 / Assets だけを見る） ──         ┃
                                     ┃
    Question                         ┃
       │                             ┃
       ▼                             ┃
   Analyzer                          ┃
       │                             ┃
       ▼                             ┃
   Asset Request                     ┃
       │                             ┃
       ▼                             ┃
   Provider ━━━ Runtime Assets を読む ┛
       │
       ▼
   Context
       │
       ▼
      LLM


── Policy（両世界を仲介する。どちらの World にも属さない） ──

   Runtime の miss を受け取り、方針に従い Asset Pipeline を起動する
   起動契機（Lazy / Eager / Nightly Batch / Manual）を管理する
```

### 4.2 依存方向

**【決定事項】**

- 依存は Original → Compile World → Runtime Assets → Runtime World の一方向のみ。
- Runtime World は Original を参照しない。
- Compile World と Runtime World は直接依存しない。接点は Runtime Assets Store のインターフェースのみ。
- Compile World と Runtime World の仲介は Policy が行う。

### 4.3 Original が Runtime 図に現れない理由

Runtime World の図に Original が現れないのは省略ではなく、Compile/Runtime 分離の構造的帰結である。Original は Compile World の入力であり、その世界の内部で完結し、Runtime へは Runtime Assets という形でしか漏れない。

---

## 5. Compile World

### 5.1 責務

Original を入力として Runtime Assets を生成する世界。「何を生成するか」を担当し、「いつ生成するか」は担当しない（後者は Policy）。

### 5.2 構成要素

- Original Store（Original を保持。読み取り専用・永続）
- Asset Pipeline（Index Compiler / Derived Generator）
- Runtime Assets Store への書き込み経路

### 5.3 評価軸

**Compile World の存在自体はスケール・コスト・運用性で評価する。** 実行時に Original を都度解析せず、事前または契機駆動で Runtime Assets を用意することで、実行時コストとレイテンシを一定に保つ。正答率には直接寄与しない。

### 5.4 決定事項

**【決定事項】**

- 入力は Original のみ。他の Runtime Asset を永続的な入力（根拠）にしない。
- 生成結果は Runtime Assets Store へ書き込む。
- Original を編集しない。

---

## 6. Runtime World

### 6.1 責務

Runtime Assets のみを用いて質問へ応答する世界。Original を参照しない。

### 6.2 構成要素

- Analyzer
- Provider
- LLM Runtime
- Runtime Assets Store からの読み取り経路

### 6.3 評価軸

**Runtime World の各コンポーネントは正答率で評価する。** ただし「Runtime が Original を持たない」という分離そのものはスケール・コスト・運用性で評価する（正答率には中立）。

### 6.4 決定事項

**【決定事項】**

- Runtime は Original を直接参照しない。
- Runtime は Runtime Assets のみを利用する。
- Runtime 内での生成（Compile / Generate）は行わない。生成契機は miss として Policy へ委ねる。

---

## 7. Runtime Assets

### 7.1 分類

Runtime Assets は Index と Derived の二種類に分類される。

### 7.2 Index

**【決定事項】**

- Original を決定論的に変換した、情報を保存・検索するための表現。
- 情報を追加せず、表現のみを変換する。
- Original のみを入力とし、同一入力に常に同一出力を返す（冪等）。
- Original から損失なく再生成可能。
- 生成工程を Compile と呼ぶ。

**Index の例**: QuoteIndex、SpeakerIndex、CharacterIndex、OffsetIndex、TimelineIndex、NameIndex/AliasIndex。

**評価軸**: Index 設計は**正答率で評価する**（該当箇所へ到達できるかが局所事実問題の正答を決める）。

### 7.3 Derived

**【決定事項】**

- Original を基に LLM が生成する二次成果物。
- 新しい意味を含み、非決定論的。
- Source of Truth ではなく、キャッシュとして扱う。破棄・再生成可能。
- Provenance（元 Original 版・モデル・プロンプト版・生成日時）を必ず付与する。
- 生成工程を Generate と呼ぶ。

**Derived の例**: BookSummary、ChapterSummary、CharacterSummary、Theme、Profile、Relationship（解釈を含む場合）。

**評価軸**: Derived 品質は**正答率で評価する**（要約・解釈系問題の正答を決める）。

### 7.4 Index / Derived の判定基準

新しい Asset 種別を追加する際は、次の一問で分類する。

> **「その Asset は Original から機械的・決定論的に再現できるか？」**
> - **YES** → Index（Compile）。Index Compiler が担当。
> - **NO（LLM や意味判断が必要）** → Derived（Generate）。Derived Generator が担当。来歴付与必須。

### 7.5 検討事項（本設計では確定しない）

> **検討事項**: 「関係（Relationship）」のように、共起の事実（決定論的＝Index 的）と解釈（非決定論的＝Derived 的）が同居する種別の扱い。同一場面への共起は Index、敵対・友好等の解釈は Derived、と分割するのが自然だが、境界の具体化は第17章で PoC 評価とする。

---

## 8. Asset Pipeline

### 8.1 責務

Runtime Assets を生成する機構。「何を生成するか」のみを担当する。「いつ生成するか」は Policy が担当する（Mechanism / Policy 分離）。

### 8.2 構成

```
Asset Pipeline
   ├── Index Compiler    （Index を決定論的に生成）
   └── Derived Generator （Derived を LLM で生成）
```

### 8.3 Index Compiler

**【決定事項】**

- Original のみを入力とし、冪等な決定論的変換を行う。
- 情報を追加せず、表現のみ変換する。
- 生成に LLM を用いる場合、LLM は候補生成器として扱い、出力を Original と機械的に照合・検証して確定する。検証を経ない LLM 出力を Index として確定しない。

### 8.4 Derived Generator

**【決定事項】**

- Original を入力とし、新しい意味を生成する。
- 出力に Provenance を必ず付与する。
- 出力はキャッシュであり Source of Truth ではない。
- 内部で Prompt Builder → LLM API → JSON パース → Runtime Asset 化の工程を持つ。Prompt は Compile のソースではなくツールチェーンであり、内部実装として隠蔽してよい。ただし Prompt 版は来歴として記録する。

### 8.5 評価軸

Pipeline の**出力品質（Index の網羅性・Derived の品質）は正答率で評価する**。Pipeline を Runtime から分離している構造自体はスケール・コスト・運用性で評価する。

---

## 9. Analyzer

### 9.1 責務

質問を解析し、応答に必要な Asset の種別を決定して Asset Request を生成する。

### 9.2 処理

**【決定事項】**

- 質問の意図（intent）を分類する。
- intent を required_assets（必要な Runtime Asset の種別リスト）へ翻訳する。
- Original を参照しない。Runtime Assets の実体も参照しない（種別の決定のみ）。

### 9.3 Asset Request の構造例

```
intent = IDENTIFICATION
required_assets = [ CharacterIndex, NameIndex ]
```

```
intent = SPEAKER_ATTRIBUTION
required_assets = [ QuoteIndex, SpeakerIndex ]
```

```
intent = BOOK_SUMMARY
required_assets = [ BookSummary ]
```

### 9.4 設計上の位置づけ

「要求を Asset 種別へ翻訳する」機能は、かつて Planner が担っていた仕事のうち決定論的な部分である。質問前に何を作るかを先読みする機能（未来予測）は V3 では採用しない。Analyzer は「今来た質問が何を要求しているか」のみを翻訳する。

### 9.5 評価軸

**Analyzer は正答率で評価する。** intent → required_assets の写像が誤ると、正しい Asset を取りに行けず下流が全て無駄になるため、正答率への寄与が最も大きいコンポーネントである。

### 9.6 検討事項

> **検討事項**: Index で足りるか Derived が要るかが質問文だけからは一意に決まらない場合（例:「どう思ったか」で原文に反応が明示されているか否か）。「Index を試み、不足なら Derived へフォールバックする」段階的 required_assets の要否は第17章で PoC 評価とする。

---

## 10. Provider

### 10.1 責務

Asset Request に従って Runtime Assets を読み取り、Context を構築する。

### 10.2 決定事項

**【決定事項】**

- **読み取り専用**。Runtime Assets を生成・書き込みしない。
- **Original を参照しない。**
- 複数の Runtime Asset を実行時に組み合わせて Context を構築してよい（read-time composition。例: QuoteIndex で位置を得て SpeakerIndex を引く）。これは実行時の組み合わせ利用であり、Asset 間の永続的依存ではないため許可される。
- 要求された Asset が存在しない場合（miss）、生成を試みず miss を返す。miss の後続処理は Policy が決定する。
- **Provider が miss 時に Asset Pipeline を直接起動してはならない。** これは書き込みに準じる副作用であり、かつ特定の Policy（Lazy）を Runtime に焼き込むため、Mechanism / Policy 分離に反する。

### 10.3 評価軸

**Provider の Asset 合成ロジックは正答率で評価する**（複数 Index を組み合わせる問題の正答を握る）。読み取り専用・Original 非参照という制約はスケール・コスト・運用性の側の要請である。

---

## 11. Runtime

### 11.1 Runtime の一連の流れ

```
Question
   │
   ▼
Analyzer        （intent 分類 → Asset Request 生成）
   │
   ▼
Asset Request
   │
   ▼
Provider        （Runtime Assets を読む。無ければ miss）
   │
   ├── ヒット ─→ Context ─→ LLM ─→ 応答
   │
   └── miss ──→ Policy へ（第12章）
```

### 11.2 決定事項

**【決定事項】**

- Runtime は Analyzer → Provider → Context → LLM の順で進む。
- Runtime 内で生成は行わない。miss は Policy へ委ねる。
- LLM Runtime の入力は Context のみ。Original や Runtime Assets を直接参照しない。

---

## 12. Policy

### 12.1 責務

Asset Pipeline の起動契機のみを管理し、Compile World と Runtime World を仲介する。生成内容には関与しない。

### 12.2 miss の仲介

**【決定事項】**

- Runtime の miss を受け取り、方針に従って Asset Pipeline を起動するか否かを決定する。
- Policy はどちらの World にも属さず、両者を仲介する独立概念とする。

### 12.3 生成契機の方針

**【決定事項（概念として）】/【PoC評価（具体選定）】**

Policy は少なくとも以下の生成契機を想定する。概念としては確定だが、PoC で初期採用する方針の選定は PoC 評価とする。

| 方針 | 挙動 |
|------|------|
| **Lazy** | miss 発生時に Pipeline を起動し、生成後に Provider を再実行する。 |
| **Eager** | 作品登録時等に事前生成する。Runtime では原則 miss が発生しない。 |
| **Nightly Batch** | 夜間バッチで生成・更新する。 |
| **Manual** | 運用者の手動指示で生成する。 |
| **Strict** | 生成せず「未生成」を返す。 |

### 12.4 Lazy に関する重要な注記

Lazy は「Runtime 中に生成が走る」方針だが、これは Compile/Runtime 分離に反しない。生成を起動するのは Policy であり、Runtime（Provider）ではない。Provider は miss を返して仕事を終える。その先で Pipeline を起こすのは Runtime World の外にいる Policy であり、生成は Compile World の中で起きる。「生成契機が質問であること」と「Runtime が生成すること」は別である。

### 12.5 評価軸

**Policy（Mechanism / Policy 分離）はスケール・コスト・運用性で評価する。** 正答率には寄与しない。運用方式（Lazy / Eager 等）を、Compile World・Runtime World のコードを変更せずに差し替えられることが価値である。

---

## 13. データフロー

### 13.1 Compile World フロー（Asset 生成）

```
1. Policy が起動契機を判断し、Asset Pipeline へ生成要求を出す
   （契機は方針依存: 作品登録 / miss / 夜間バッチ / 手動）
2. Asset Pipeline が Original Store から Original を読む
3. 種別に応じて振り分け
   - Index 種別   → Index Compiler   → 決定論的変換（+ Original 照合検証）
   - Derived 種別 → Derived Generator → LLM 生成（+ Provenance 付与）
4. 生成結果を Runtime Assets Store へ書き込む
```

### 13.2 Runtime World フロー（ヒット時）

```
1. Question を受信
2. Analyzer が intent を分類し Asset Request を生成
3. Provider が Asset Request に従い Runtime Assets Store を読む
4. 全 required_assets が存在（ヒット）
5. Provider が Runtime Assets を組み合わせて Context を構築
6. LLM Runtime が Context から応答を生成
```

### 13.3 Runtime World フロー（miss 時・Policy 仲介）

```
1〜3.（13.2 と同じ）
4. Provider が required_assets の一部/全部を発見できず miss を返す（Provider はここで終了）
5. Policy が miss を受け取る
6. 方針に従い分岐
   - Lazy   → Asset Pipeline を起動 → 生成完了後 Provider を再実行（→ 13.2 の 3 へ）
   - Eager  → 本経路は原則発生しない（事前生成済み）
   - Strict → 「未生成」を応答として返し終了
```

**重要**: Runtime World のフローに Asset Pipeline への直接の矢印は存在しない。Pipeline 起動は必ず Policy を経由する。

### 13.4 データフロー上の不変条件

**【決定事項】**

- Original → Compile World → Runtime Assets → Runtime World の一方向のみ。逆流しない。
- 両 World の接点は Runtime Assets Store ただ一つ。

---

## 14. コンポーネント責務一覧

| コンポーネント | 所属 | 責務 | 状態 | 評価軸 |
|----------------|------|------|------|--------|
| Original Store | Compile World | Original を保持・供給 | 読み取り専用・永続 | スケール・コスト・運用性 |
| Asset Pipeline | Compile World | Runtime Assets を生成（何を作るか） | — | 出力品質=正答率／分離=スケール等 |
| Index Compiler | Compile World | Index を決定論的に生成 | 冪等 | 正答率（網羅性） |
| Derived Generator | Compile World | Derived を LLM で生成 | 非決定論的 | 正答率（品質） |
| Runtime Assets Store | 受け渡し面 | Assets を保持・供給 | 読み書き分離 | スケール・コスト・運用性 |
| Analyzer | Runtime World | 質問→Asset Request | ステートレス | 正答率（最重要） |
| Provider | Runtime World | Assets 読取→Context 構築 | 読み取り専用 | 正答率（合成） |
| LLM Runtime | Runtime World | Context→応答 | — | 正答率 |
| Policy | 仲介 | 起動契機の管理（いつ作るか） | 差し替え可能 | スケール・コスト・運用性 |

---

## 15. 拡張方針

### 15.1 新しい Asset 種別の追加

**【決定事項】** 7.4 の判定基準で Index / Derived に分類し、対応する棚（Index Compiler / Derived Generator）へ追加する。既存コンポーネントの責務境界は変更しない。

### 15.2 検索アルゴリズムの進化

**【決定事項】** BM25・Embedding・Graph・独自 Index 等いずれを採用しても、Asset Pipeline および Provider の内部実装に閉じ込める。Original は変更しない。Runtime Assets のインターフェースが安定していれば内部手法は自由に進化できる。

### 15.3 Embedding の扱い（要注意種別）

> **検討事項**: Embedding は「Original に対しては決定論的だが、モデルに対しては非決定論的」という中間種である。Index 棚に置く場合は「どのモデルで生成したか」を来歴に必須化する。分類ポリシーの明文化は第17章で PoC 評価とする。

### 15.4 Policy の拡張

**【決定事項】** 新しい起動契機は Policy の実装として追加する。Compile World・Runtime World には影響を与えない。

### 15.5 LLM プロバイダの変更

**【決定事項】** Derived Generator が用いる LLM プロバイダの変更は、来歴に記録した上で既存 Derived を選択的に無効化・再生成して対応する。Index は影響を受けない。

---

## 16. PoC方針

### 16.1 PoC の目的

> **HumanMemoryLayer V3 が、スケール制約下で高い正答率を実現できるかを実測で検証すること。**

PoC は正答率で判定する。ただし裸の正答率ではなく、コスト・レイテンシ制約下でスケールしても維持される正答率を見る。

### 16.2 評価軸の分離（PoC でも厳守）

- **正答率で評価する要素**: Analyzer、Index 設計、Provider、Derived 品質。
- **スケール・コスト・運用性で評価する要素**: Compile/Runtime 分離、Mechanism/Policy 分離。

分離的要素は 5問・100問では正答率差を生まない。作品数が増えて初めて効く。「PoC で正答率に効かない＝不要」と即断しない。

### 16.3 スモークテスト（5問）

まず 5問程度で「この設計思想で正答率改善が見込めるか」を確認する。目的は正誤確認だけでなく、**V3 経路が全文投入からどれだけ劣化するか**の測定である。

| # | 質問例 | 検証する構造 | 必要 Asset（想定） |
|---|--------|--------------|--------------------|
| 1 | ヒラメとは誰か | 単一 Index でヒット経路が完結するか | CharacterIndex + NameIndex |
| 2 | 「ワザ。ワザ」と言ったのは誰か | 2 Index の read-time composition | QuoteIndex + SpeakerIndex |
| 3 | 「ワザ。ワザ」と言われて主人公はどう思ったか | Index で足りるか Derived が要るかの境界 | QuoteIndex + 反応系（Index or Derived） |
| 4 | ヒラメと堀木の関係は | Relationship が Index か Derived か | CharacterIndex + Relationship 系 |
| 5 | あらすじを教えて | miss→Policy→生成→再実行の経路 | BookSummary（Derived） |

**スモークテストの必須手順**: 各問で V3 経路の答えと全文投入の答えを並べて比較し、V3 が全文投入からどれだけ劣化したかを測る。劣化がなければ「間接層は正答率を損なわない」と確認でき、大規模評価へ進める。大きく劣化する問題種別があれば、その Asset 設計を修正する。

### 16.4 段階的拡張

5問（スモーク）→ 100問 → 500問 と拡張し、各段階で V2 との比較を行う。500問規模では正答率に加え、コスト・レイテンシ・作品数スケール時の挙動も測定する（16.2 の分離的要素はこの段階で評価する）。

### 16.5 PoC の合否観点

- **正答率観点**: V3 が V2 の正答率を上回るか。V3 が全文投入から大きく劣化しないか。
- **構造観点（正答率とは別基準）**: miss から生成完了までの経路が Provider ではなく Policy を通っているか。Provider の呼び出しスタック内から Asset Pipeline が起動されていた場合、正答が得られても構造としては不合格とする。

### 16.6 PoC スコープ（推奨）

- Index: QuoteIndex、SpeakerIndex、CharacterIndex、NameIndex の 4 種。
- Derived: BookSummary の 1 種。
- Policy: 単一方針（Lazy 推奨）から開始し、miss→生成→再実行を検証。
- 主眼: 正答率（V2 比・全文投入比）と、選択的無効化・タイミング独立が成立するか。

---

## 17. PoCで確定する項目（未確定事項）

本章の項目は【PoC評価】であり、実装時は暫定として扱う。PoC の実測を経て確定する。

### 17.1 正答率に直接関わる未確定事項

1. **Analyzer の intent 分類体系と intent → required_assets 写像テーブル**。特に「どう思ったか」型の分類（Index か Derived か）と、段階的フォールバック（Index を試み不足なら Derived）の要否。
2. **Index の粒度と網羅性**。局所事実問題で全文投入に劣化しない粒度。
3. **Provider の Asset 合成ロジック**。複数 Index 組み合わせ問題で文脈分断による劣化が生じないか。
4. **Derived の生成品質**。要約・解釈系で全文投入の要約に匹敵するか。
5. **Relationship 種別の Index / Derived 分割方針**（共起=Index、解釈=Derived の境界）。

### 17.2 スケール・コスト・運用性に関わる未確定事項

6. **初期 Policy の選定**（Lazy / Eager のいずれから始めるか）。
7. **選択的無効化の実効性**（モデル更新時に Index を温存し Derived のみ再生成できるか）。
8. **タイミング独立性の実測**（生成契機を変えても Index が同一になるか＝冪等の確認）。
9. **Embedding を導入する場合の分類ポリシー**（Index 棚に置く際の来歴必須化の運用）。

### 17.3 スキーマ・基盤に関わる未確定事項

10. **Runtime Assets のスキーマ**（各 Index / Derived のデータ構造、Derived の来歴フィールド）。
11. **Original の版管理方式**（version / hash と Asset 失効判定の連携）。
12. **Runtime Assets Store の永続化方式**（読み書き分離、Index / Derived の型区別）。

---

*本書は合意済みの HumanMemoryLayer V3 を第三者実装可能なレベルで文書化したものである。【決定事項】は実装の前提としてよい。【PoC評価】および「検討事項」は PoC の実測を経て確定する。設計原則（第2章・第4章の分離）は設計レビューの制約条件として扱い、いずれの分離にも違反しないことを合否基準とする。*
