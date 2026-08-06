---
title: "Chief of the Valley: The First Devlog"
date: 2026-05-25
tags: [gamedev, devlog, chief-of-the-valley]
summary: >
  Building a turn-based PC company sim in C++17 and raylib from scratch.
  Everything that got built, broken, and rebuilt on the way to v0.4.
read_time: 9
pinned: false
featured: true
toc: true
---

<img src="/assets/images/valley-chief-blog-banner.png" alt="Chief of the Valley" style="width:100%;max-width:1200px;margin-bottom:1.4em;">

Chief of the Valley is a turn-based PC company simulator I have been building as a solo project. The premise is simple: you start at Year 0001 as a one-person PC software company, take out loans, hire staff, sign contracts, research technology, license software from third parties, and compete against NPC companies as the industry evolves through distinct eras. The goal is to grow your company into something worth running, before the market or your own mismanagement does it for you.

This is the first proper devlog entry. It covers everything from the initial design decisions through v0.4.

## Why C++ and raylib

The short answer is that I wanted to build something real without hiding behind an engine.

I have spent enough time with Unity and Unreal to know how they work. What I was interested in here was not shipping fast, it was understanding the full stack. How does a game loop actually work when you write it yourself? What does a UI system look like when you have to build it from scratch? What breaks when you have to think about every allocation?

raylib is the right library for that kind of project. It is MIT licensed, small, handles window creation, input, audio, and rendering without any opinion about how you structure the rest of your code. No entity-component system pushed on you. No scripting layer. No scene graph you have to fight. You get a framebuffer and a set of draw functions and the rest is up to you.

For serialization I used nlohmann/json, a header-only library that stays completely out of the way. CMake with presets for the build system, which made it straightforward to support both a Linux native build and a Windows cross-compile target from the same machine.

The architecture decision I made early and stuck with: game state is the single source of truth. Every screen reads from it. Only the turn simulation and the save-load path write to it. No mutation from UI code. It sounds obvious but it is the kind of rule that is easy to violate the moment you are deep in a feature and want to just quickly update a value from a draw function.

## What Got Built: v0.1

v0.1 was about getting a loop that actually worked.

The core of it is a 12-step advance function that runs once per "End Week" button press. In order: zero out the weekly profit and loss, process morale and efficiency, pay salaries, tick contracts, advance products, tick tech research, run NPC AI, update the market, refresh available opportunity boards, fire scripted events, check era transitions, emit news and check for game-over conditions, and finally record a valuation snapshot. Every step calls into a dedicated helper, and the helpers do not touch each other's state directly. When something breaks, the step that caused it is almost always obvious from the ordering.

The UI is a fixed-layout shell: a header strip with the company name and cash balance, a left sidebar with navigation tabs, a main panel where screens render, and a footer with the week and year display and the End Week button. Screens are not widgets. They are plain drawing routines that receive the game state, a panel rectangle, and a visual theme, and draw whatever they need inside that rectangle. No class hierarchy beyond what is necessary, no retained-mode state outside of a small set of modal windows managed at the top level.

The skin system was in from v0.1. Each era has a theme containing color tokens and font sizes. The visual layer tracks the current era and swaps to a new theme when the first tech node of a new era tier unlocks. Era boundaries are driven by the tech tree, not a calendar, which means a company that aggressively researches early technology gets the visual upgrade before one that does not.

## v0.2: Loans, Tech, Licenses, and Staff

v0.2 was the bulk of the systems work. Four major additions, all of them interconnected.

### The Loan System

Early drafts tracked loans as a single balance number. That lasted about a week before it became clear that modeling realistic loan behavior requires individual loan records. Each record carries its tier, principal, remaining balance, weekly installment, interest-free weeks remaining, and whether an asset has been pledged against it.

Every turn the finance step ticks each loan: it counts down the interest-free period, then applies interest plus the installment debit. If the company doesn't have enough cash, the overflow hits the player's personal account. Loans that reach zero balance are removed automatically. Asset pledging locks the asset on the player record and clears it when the loan closes.

The UI for this is a tabular list in the Company screen with expandable rows. Each row shows the balance, installment, and weeks remaining. Expanding it opens a slider for paying extra toward principal. Adding a new loan goes through a three-step modal: choose a credit tier, set an amount, optionally pledge an asset. There are fifteen credit tiers, ranging from small personal loans to large institutional credit lines with long interest-free periods and strict net worth requirements.

### The Tech Tree

Every tech node is data-driven: name, branch, prerequisites, research time in weeks, era tier, and what it unlocks. Adding a new node is a text file edit with no recompile. The game engine only knows about node identifiers at runtime.

Research is single-threaded: one node at a time, ticking each turn. The tree always knows which nodes are available based on what has already been unlocked. When a node completes, the system checks whether it was the first of a new era tier. If so, an era transition fires, which triggers the skin swap and the music crossfade.

### The License System

Some product features require third-party licenses in addition to having the relevant tech unlocked. Available licenses are gated on both tech and other held licenses. Annual fees are auto-debited each year. Everything is defined in a data file.

The reason licenses are a separate layer rather than being folded into tech is business model accuracy. In the era the game simulates, the ability to ship certain kinds of software was genuinely gated by commercial licensing agreements, not just technical capability. Separating them lets the game model that distinction rather than flattening it.

### Staff

Staff gained skills, morale tracking, break status, and training queues. The efficiency multiplier applied to all research and product progress each turn is computed from the average morale of staff who are actually working, not resting, not in training. Training ticks automatically and completes with a notification and a skill level increment. All the name pools, salary baselines, skill definitions, training costs, and morale parameters come from a data file.

### The Data-Driven Architecture

By the end of v0.2, every balance-affecting constant in the game came from data files rather than being hardcoded. In debug builds, pressing F5 triggers a hot-reload: it re-parses all the data files, does an atomic swap if everything is clean, and shows a success or failure notification. This made balancing much faster because I could change a value and reload without rebuilding. The same mechanism means designer-level changes like adding a tech node, adjusting a salary formula, or tweaking morale decay never require touching C++ code.

## v0.3: Stock and Sound

v0.3 added two things: the stock market screen and audio.

The stock screen tracks weekly company valuation snapshots capped at one year of history. A TICKER sub-tab renders a line graph drawn entirely with raylib's drawing primitives, no external charting library. The axes, labels, and graph line are all immediate-mode draw calls inside the panel rectangle. It is simple but it gives you the one thing you actually want to see at a glance: which direction is the company moving.

Audio was more involved than I expected. raylib's audio system has a strict initialization and teardown order relative to the window, and getting that wrong produces crashes that are not immediately obvious in the call stack. Five click sounds play randomly on each left click. Five era music loops cross-fade when an era transition fires. All audio resources unload in the right sequence before the window closes.

The CRT shader also got real attention in v0.3. The shader parameters (scanline intensity, curvature, vignette, chromatic aberration) are loaded per era from data files. Each era gets its own set of values, ranging from heavy scanlines and strong curvature in Dawn to a much cleaner look in Modern. The post-processing pass runs on a render texture that gets composited to the screen at the end of each frame.

## v0.4: Polish and the Critics

v0.4 was about filling in the gaps and making the moment-to-moment feel better.

### Menu Overhaul

The main menu got a proper pass. It now uses BowlbyOne as the display font, which matches the retro era feel of the game. Background images and a logo were added. Earlier versions had accent colors that shifted based on some internal era state. That was removed: the menu always uses a single fixed green regardless of where you are in the tech tree. It is cleaner. The menu's visual job is to set a tone, not preview a system.

A splash screen was added in the final stretch of v0.4. Nothing elaborate: the game name, the version, a brief pause. But it removes the jarring immediate jump into the main menu on launch.

### Product Score and the Critics Modal

Product quality was previously scored as an integer from 0 to 100. I changed it to a decimal from 0 to 10. The underlying value is the same calculation, but scoring out of ten is how people actually talk about games and software. It reads more naturally in the UI and keeps all the displayed numbers in a range that feels human.

The critics modal is the main new feature of v0.4. When you ship a product, a modal appears showing five critics responding to it. Each critic has a name, a role (trade journalist, hobbyist magazine reviewer, that kind of thing) and a comment drawn randomly from a score bracket. The five brackets map to terrible, poor, mixed, good, and great. Each critic has eight possible lines per bracket, giving 200 total unique review lines across the five critics.

The comments animate in as a typewriter effect, with a short pause between each critic finishing and the next one starting. The overall score only appears after all five critics are done, which means you have to read through the responses before seeing the number. Clicking anywhere skips the current animation. The modal height is computed dynamically based on the actual wrapped content. If a comment runs long and wraps to two lines, the modal is tall enough to show it.

All critic data is stored in a separate data file and hot-reloads along with everything else. Adding a new critic line or adjusting what comments fall into which score bracket is a text edit.

### UI Consistency Pass

Throughout the game there are UI elements that draw text on top of an accent-colored background: tab bars, selected states, score badges. The skin system has always had a dedicated token for text color in those situations, tuned per era, but several screens were not using it and were falling back to a general text color that happened to be legible by accident. v0.4 fixed all of them. The visual result is consistent high-contrast text in every accent context across all eras, rather than something that works most of the time.

The version string got a similar treatment. It was hardcoded in two places. It now lives in a single config file and both screens read it from there. Updating the version for a new build is one edit.

## Where Things Stand

v0.4 has all the core systems: loans, tech tree, licenses, staff, contracts, products, market, NPC AI, scripted events, era transitions, save slots with migration, a CRT post-processing pass, era music, and a critics modal. The data-driven architecture means balance changes are text file edits and nothing in the game loop has hardcoded constants.

The parts that are still rough: the market simulation is functional but shallow. NPC behavior is predictable enough to learn and exploit once you understand the patterns. The product creation flow could use more depth. None of that is surprising for a project at this stage. The systems are in. The tuning is next.

More builds to follow.
