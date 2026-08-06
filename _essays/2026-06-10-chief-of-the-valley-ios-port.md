---
title: "Porting Chief of the Valley to iOS"
date: 2026-06-10
tags: [gamedev, devlog, chief-of-the-valley]
summary: >
  Taking a desktop management sim to iPad and iPhone. Landscape orientation,
  touch targets, scroll behavior, audio, an in-game keyboard, and the
  legibility decisions that come with high-density displays.
read_time: 7
pinned: true
featured: true
toc: true
links:
  - /essays/2026-05-25-chief-of-the-valley-first-devlog
  - /essays/2026-06-10-chief-of-the-valley-devlog-2
---

Chief of the Valley was designed for desktop: keyboard and mouse, a window you size to your liking, a screen you sit in front of. Moving it to iOS meant questioning each of those assumptions and deciding which ones to keep, which to replace, and which to route around.

The game is turn-based and session-friendly. You can play it for five minutes or an hour, pick it up and put it down. That play pattern suits a tablet. An iPad on a desk is a genuinely good environment for a management sim. The decision to port was not hard to make. What follows is what actually had to change.

## Landscape Only

The original layout is fixed: a navigation sidebar on the left, a main content panel taking up most of the screen, a header strip at the top and a footer at the bottom. That layout requires horizontal space. On a tablet in either landscape orientation there is room to make it work. On a phone in portrait, the sidebar would crowd the content panel into something too small to read.

The iPad version can rotate freely between landscape-left and landscape-right. The iPhone version locks to landscape only. That is a layout decision, not a platform constraint. The sidebar width was set for a desktop display, and the consequences of that choice play out differently depending on what you are holding.

## Touch Targets

Mouse cursors are precise. A button can be small because you can point at anything you can see. Fingers are not precise. A button that is comfortable to click with a mouse is frustrating to tap reliably on a touch screen, especially near the edges of the device or when you are holding it one-handed.

The fix is to make everything's tappable area larger than its visible area. Interactive elements in the game (buttons, navigation tabs, list rows) have hit regions that extend beyond their visible edges. The layout looks the same. The invisible margin around each element absorbs the imprecision of a tap and means you do not have to aim carefully to interact with things.

## Scrolling Through Lists

Several screens in the game are lists: staff, contracts, licenses, tech nodes. On desktop you scroll them with the mouse wheel. On a touch screen you drag.

The question is when a drag on a list counts as scrolling versus selecting the item underneath the finger. The answer here: if the gesture moves past a small vertical threshold, it was a scroll, and releasing the finger should not activate the row it ends on. If it did not move, it was a tap. Without that distinction, browsing a long list becomes a minefield of accidental selections. With it, you can drag freely and tap deliberately.

## Audio

iOS is often used while other audio is already playing. Someone might have music or a podcast running when they open the game. The question is how the game should behave relative to whatever the user already has going.

The choice was to have game audio mix with system audio rather than replace it. The era music and sound effects play alongside whatever else is running, and the hardware ringer switch silences everything. This means the game does not interrupt a player who is listening to something else. For a management sim where you are mostly reading information and making decisions, cutting off a podcast to hear button sounds is not a worthwhile trade.

## Safe Area

Recent iPhones have screen elements that sit in the margins: the home indicator at the bottom, notches and cameras at the top. Those areas are not fully available for gameplay. Drawing interactive elements there means competing with system gestures or placing things behind hardware.

The game keeps the active layout out of those margins. The one that required the most attention is the home indicator at the bottom of the screen. Anything placed in that region risks being intercepted before the game sees the touch. Knowing how much margin to leave and adjusting the layout accordingly is part of designing correctly for the device.

## The In-Game Keyboard

Text input happens in two places: naming a company when starting a new game, and naming a save slot. On desktop you type. On iOS the obvious approach is to bring up the system keyboard.

The system keyboard was not used. The reason is layout stability. When the system keyboard appears, the available screen area changes. Every screen would need to know the keyboard's current height and reflow its content around it. The game has five era themes, multiple screen layouts, and a rendering model that draws fixed panels. Introducing a dynamically-sized intrusion into that model creates a large surface area for things to go wrong across every screen, every era, every device size.

The alternative was to build a keyboard inside the game itself. It slides in from the bottom, covers the area it needs, handles the characters relevant to a company name or save slot label, and uses the game's existing visual theming. When it is not needed, it is not there.

The trade-off is that it is not a native iOS input. Autocorrect, spell check, and third-party keyboards do not apply. For a company name field in a PC management simulator, that is acceptable.

## Legibility on High-Density Displays

Desktop games commonly compute their layout by dividing the screen height by a reference resolution and scaling everything proportionally. That works on desktop. On iOS it can produce elements that are physically smaller than intended, because high-density displays pack many more pixels into the same physical space.

The consequence is that buttons and text that look fine on a monitor can be small enough on a retina device that they are hard to read and uncomfortable to tap. Apple's own guidelines set minimum sizes for touch targets based on physical dimensions, not pixel counts. Getting those targets right requires understanding the display's density and scaling the layout to match.

The current build handles this correctly on iPad. Getting it fully right on the smallest iPhone screens is still in progress, and it is the remaining known issue before the game is ready for the App Store.

## Where Things Stand

The game runs on iPad. Touch input works as intended, list screens scroll without accidental taps, audio respects the user's listening context, and text entry uses a self-contained keyboard that does not disturb the layout. The legibility and sizing on small iPhone screens is the last thing to resolve before a submission makes sense.

More builds to follow.
