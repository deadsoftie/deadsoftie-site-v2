---
title: "Chief of the Valley: Devlog 2, v1.0"
date: 2026-06-06
tags: [gamedev, devlog, chief-of-the-valley]
summary: >
  Staff overhaul, Steam integration, a bug report tool, and the fixes that had
  to happen before calling it v1.0.
read_time: 6
featured: true
toc: true
links:
  - /essays/2026-05-25-chief-of-the-valley-first-devlog
---

The first devlog ended at v0.4 with all the core systems in: loans, tech tree, licenses, staff, contracts, products, market, era transitions, and a CRT post-processing pass. The next question was what v1.0 actually meant. This post covers what happened between that point and shipping it.

## Staff

### Organisation

The staff screen was functional but not easy to scan. When you have ten people on the payroll it does not matter much. When you have twenty, finding a specific engineer without reading through designers and sales staff first starts to feel like the game working against you. The screen now sorts by role and shows the role alongside each person's name. Small change, noticeable improvement in the mid-game.

### Morale

Morale was previously modeled as a value that only moved in response to significant events: a firing, a failed product launch, a missed payroll. Between those events it was effectively stable. That is not quite right.

The overhaul introduced a slow, steady weekly decay. Staff who are working and never getting breaks lose morale gradually just from the grind. The decay is small enough that attentive players will not notice it, but it accumulates if you push everyone through continuous work cycles without rest. The tension it creates is the point. Morale management becomes an ongoing obligation rather than something you only think about when a crisis hits.

The same update added promotions. When a staff member reaches a new skill threshold through training, they get promoted and the game acknowledges it. It closes the feedback loop on the investment: you put someone through training, they improved, and the moment is marked.

## Fixes That Had to Ship

A few things were wrong in ways that had no business surviving into a v1.0.

### Declining Phase

Product revenue follows a lifecycle: strong initial reception, a plateau, then a gradual decline to zero. The decline phase was not working. Products that should have exhausted their revenue were staying profitable indefinitely. Getting this right is fundamental to the game. The whole point of the product loop is that you cannot coast on past launches. Old releases should stop paying eventually, and they were not.

### Loans

There was a logic error in the personal-ruin condition. Players who had accumulated serious personal debt were not hitting the game-over that should have ended their run. The ruin check was not triggering correctly in those cases. Fixed.

### Contract Deadlines

Deadlines exist for contracts and they matter, because a missed one costs reputation and money. They were visible if you knew exactly where to look, but not surfaced clearly enough for a player to track without effort. The contracts screen now shows them plainly.

### Tech Tree

The tech tree display had a bug where certain node configurations would appear incorrectly. Fixed.

## Steam

### Achievements

The achievement set is designed around moments the player already understands as significant: shipping a first product, completing a full era transition, hitting meaningful company valuation milestones. The reasoning is that achievements should reward things that already feel like accomplishments in the game, not construct artificial tasks on top of it.

### Cloud Saves

Save slots sync automatically. For a game you might play across multiple machines or in short sessions over several days, not having to think about which file is current removes a small but real friction.

## Personal Achievements

Separate from the Steam achievement set, the game has its own internal milestone system on the player's personal screen. These do not unlock anything. They are just a record: a list of things you have done in this run.

The motivation for keeping them separate is that in-game milestones and public platform achievements have different design constraints. In-game ones can be personal and accumulate quietly. Public ones need to make sense as a visible record of skill. Keeping them as two distinct layers lets each be designed for its actual context.

## Bug Reporting

When something breaks and the player notices, the path to a fix depends almost entirely on whether the problem can be reproduced. The game now has a one-tap bug report that captures the full game state automatically. Players do not have to reconstruct what they were doing or describe it in text. The report arrives with everything needed to reproduce the situation.

It is accessible through the settings screen, not advertised as a feature. It is a support mechanism.

## UI Polish

### Buttons

The buttons got a proper visual pass. The earlier implementation was functional but lacked clarity in the lighter eras. The new version reads consistently across all five.

### New Game Flow

The order of the new-game setup changed. Previously you named your company first, then chose a save slot. Now you pick the slot first, then name the company. Naming something before you have decided where it lives is the wrong order.

### Contrast

Several UI elements were relying on coincidental legibility rather than deliberate contrast choices. Hint text and secondary labels now have explicitly tuned colors per era rather than values derived from the primary text color. The result is consistent and intentional across the era range instead of working by accident most of the time.

## Where Things Stand

v1.0.1 is what shipped. The work between v0.4 and v1.0 was closing off what needed closing: the bugs that should not survive a public release, the platform requirements, the day-to-day UI consistency. The core systems were already in from v0.4.

What is still rough: the market simulation is shallow, NPC behavior is predictable once you understand the patterns, and the product creation flow could use more depth. Those are v2 problems.

More builds to follow.
