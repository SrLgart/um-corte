# UM CORTE — Project Instructions

UM CORTE is a fast 2D browser fighting game built around one-hit-kill combat, precise movement, parry timing and readable interactions.

## Current project state

The current stable version is V8.

The `main` branch contains the preserved V8 baseline.

Development for the visual/game-feel overhaul happens only on the `v8.5-opus` branch.

Before making changes, inspect the existing source and the documentation in `/docs`.

Treat the actual implementation as the source of truth.

## V8.5 goal

V8.5 is primarily a visual, animation, VFX, SFX, presentation and level-design overhaul.

The objective is NOT to redesign the core game mechanics.

Major areas expected to change include:

- character visual designs
- character animation
- weapons and equipment visuals
- Legacy icons
- Legacy in-game visuals
- summons
- bosses
- arenas and environmental composition
- UI and HUD
- VFX
- SFX
- attack slash presentation
- boss presentation
- visual identity and art direction

## Preserve gameplay unless explicitly instructed otherwise

Do not accidentally change:

- hitboxes
- hurtboxes
- attack startup
- active frames
- recovery
- attack reach
- movement physics
- dash behavior
- jump behavior
- parry rules
- cooldowns
- Legacy mechanical effects
- AI logic
- save behavior
- networking behavior
- progression rules
- win conditions

If a visual change requires a gameplay change, explain why before implementing it.

## Visual philosophy

Do not preserve an existing visual design merely because it already exists.

Preserve the gameplay concept, not necessarily the current artwork.

The current V8 visual implementation is allowed to be redesigned heavily.

Avoid generic AI-looking design, repetitive geometric boxes, flat placeholder-like visuals and unnecessary rectangular UI.

Prioritize:

- strong silhouettes
- readable poses
- expressive animation
- visual hierarchy
- depth
- atmosphere
- cohesive art direction
- clear combat readability
- satisfying impact
- visually distinct Legacies
- environments that feel like real places rather than floating gameplay platforms

## Combat readability

Visual improvements must never make combat harder to read.

Startup, active attacks, parries, projectiles, hazards and important telegraphs must remain understandable.

VFX should reinforce gameplay rather than obscure it.

## Working style

Before large visual redesigns:

1. inspect the current implementation;
2. understand the mechanic being represented;
3. propose the visual direction;
4. implement a small representative sample first;
5. evaluate the result before applying it across the entire game.

Do not perform a full-project redesign before the visual direction has been validated.

## V8.5 initial strategy

The first visual work should be treated as a vertical slice.

Do not redesign everything immediately.

A representative test may include:

- one standard fighter
- the Errante
- one major summon
- one arena
- one UI screen
- one or more important VFX/powers

The purpose is to establish the visual language of UM CORTE before scaling it across the project.

## Build and source structure

Prefer editing the modular development sources rather than manually editing generated monolithic HTML builds.

Generated builds should remain outputs, not the primary source of development changes.

Preserve the ability to generate the normal and Admin single-file HTML builds.

## Documentation

Consult `/docs` whenever working on unfamiliar systems.

If implementation and documentation disagree, verify the source code before making assumptions.

Do not silently rewrite mechanics to match documentation.

## Safety rule for refactors

Do not combine visual redesign with unrelated technical refactoring.

Keep changes scoped.

When touching sensitive systems, verify that existing behavior still works afterward.