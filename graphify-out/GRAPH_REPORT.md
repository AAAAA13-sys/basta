# Graph Report - Daily Tracker  (2026-11-05)

## Corpus Check
- Corpus is ~30,528 words - fits in a single context window. You may not need a graph.

## Summary
- 158 nodes · 266 edges · 9 communities (6 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8

## God Nodes (most connected - your core abstractions)
1. `StateStore` - 21 edges
2. `AudioSynthesizer` - 17 edges
3. `setupEventListeners()` - 14 edges
4. `MockAudioNode` - 10 edges
5. `MockAudioNode` - 10 edges
6. `renderAll()` - 8 edges
7. `MockAudioParam` - 8 edges
8. `MockAudioParam` - 8 edges
9. `deepClone()` - 7 edges
10. `MockAudioContext` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (9 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (27): applyGroundingAction(), checkAlarms(), closeGroundingModal(), dismissRingingAlarm(), dom, firedAlarmsToday, formatCurrency(), formatTimeString() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (7): MockAudioContext, MockAudioNode, MockAudioParam, MockBiquadFilterNode, MockGainNode, MockOscillatorNode, mockStorageInstance

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (7): deepClone(), DEFAULT_STATE, generateId(), getLocalDateString(), StateStore, STORAGE_KEY, store

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (6): MockAudioContext, MockAudioNode, MockAudioParam, MockBiquadFilterNode, MockGainNode, MockOscillatorNode

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (3): audio, AudioSynthesizer, soundEngine

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): background_color, categories, description, display, icons, name, orientation, short_name (+2 more)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 3 inferred relationships involving `setupEventListeners()` (e.g. with `closeGroundingModal()` and `dismissRingingAlarm()`) actually correct?**
  _`setupEventListeners()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._