# TeachDB

## What is TeachDB?

TeachDB is a framework for building person-specific memory layers.

Instead of training a new LLM for every individual, TeachDB combines a shared reasoning model (such as GPT) with a dedicated memory layer that contains one person's accumulated knowledge.

GPT performs the reasoning.

The memory layer provides the knowledge.

TeachDB does not replace GPT.

It extends GPT with person-specific knowledge.

This allows AI to answer questions based on a specific individual's accumulated knowledge instead of relying only on general knowledge.

---

## Problem

Human knowledge is scattered across books, documents, interviews, letters, and archives.

Reading everything takes years.

There is no way to interact directly with one person's accumulated knowledge.

TeachDB solves this by organizing that knowledge into a person-specific memory layer that AI can use for conversation.

---

## Architecture

```
Question
      │
      ▼
Person-specific Memory Layer
      │
      ▼
GPT (Reasoning Engine)
      │
      ▼
Answer
```

---

## Long-term Vision

TeachDB is not the final product.

The long-term vision is **Kenjindo (House of Wisdom).**

Kenjindo is a digital library where every historical figure, scientist, entrepreneur, author, or teacher has their own memory layer.

People do not simply search documents.

They learn by interacting with these memory layers through AI.

TeachDB is the first building block toward that vision.

---

## Philosophy

TeachDB is not trying to replace human wisdom.

It is designed to preserve accumulated human knowledge and make it accessible through AI for future generations.
