---
title: "Moving to Linux: How I Ended Up on Fedora"
date: 2026-04-29
tags: [linux, fedora, tools, personal]
summary: >
  Copilot on the OS, a dedicated Copilot button on the keyboard, and Visual
  Studio. I had enough. Here is how the migration actually went.
read_time: 6
featured: false
toc: false
---

I bought a Lenovo Legion last year. Great machine. RTX 4060, solid build, good for development. It also came with a dedicated Copilot button on the keyboard.

Getting Copilot properly off the machine (not just disabled, actually gone, including the language packs and background services that came bundled with it) turned out to be a small project in itself. I got it done. But the fact that I had to do it at all sat with me for a while. This was the same OS that I was using for game development and academic work at DigiPen, and I was spending time undoing things the OS had installed on my behalf.

That was the tipping point. The button was just the final, physical articulation of a frustration that had been building for longer than I wanted to admit.

## The Case Against Visual Studio

I want to be fair here. Windows is not a bad operating system for game development. Most of the community at DigiPen, faculty included, recommends it and they are not wrong to do so. Shipping games needs Windows support almost by definition. Working in a team of any size, expecting everyone to run Linux is not realistic. I have watched Linus Tech Tips struggle through a popOS setup, and that man has built more computers than most people have owned. For the average person, Linux is still a journey.

That said, working with Visual Studio as my day-to-day environment has been a genuine nightmare, and the less I say about it the better. The explorer system is clunky. MSBuild management is tedious. The whole thing has a locked-in feel that I find increasingly suffocating, whether that is vcpkg or NuGet or the way the IDE seems to assume you have no preferences of your own. VSCode is a good editor. Microsoft clearly knows how to build one when they want to. Visual Studio is not that.

Between the Copilot situation and VS, I finally decided I had had enough. With how far the Proton layer has come for gaming on Linux and how well most of the development tools I actually use have matured on it, there was no reason left to stay.

## The Arch Attempt

The first distro I looked at seriously was Arch, specifically Omarchy. I wanted a Hyprland setup. It looked really cool. That was, I will be honest, basically the entire reason.

Halfway through setting it up I realised Omarchy is not designed for dual booting. Rather than accept that and move on, I tried to shoe-horn it into a dual boot configuration by following a tutorial. That turned out to be a bad idea, which in hindsight should have been obvious.

So I dropped Omarchy and tried vanilla Arch. The setup itself went fairly smoothly, better than I expected. Then the Nvidia drivers refused to cooperate. RTX 4060, not even a particularly exotic card, and it would not boot. I spent more time on it than I should have before accepting that this was not the hill worth dying on.

## Where I Actually Landed

Eventually I went with Fedora, KDE Plasma edition, and it has been genuinely great. The GUI works well out of the box, the package ecosystem is solid, and the support for graphics development specifically has not given me any serious trouble. The v2 of this blog (the one you are reading right now) was built entirely on it, which felt like a reasonable test.

I did hit Nvidia driver issues here too, because of course I did. But this time I was able to work through them without losing days to it. This is actually where I want to give a proper mention to using AI for troubleshooting: instead of digging through decade-old forum threads full of partially answered questions and obsolete commands, I just talked through the driver issue with Claude and had it sorted in a fraction of the time. For anyone who wants to make this kind of migration but is nervous about the troubleshooting overhead, that is genuinely the thing that makes it manageable now.

I might move to Arch eventually. The Hyprland setup is still appealing and once I have been on Fedora long enough to feel confident about what I am doing, it is probably worth trying again properly. But right now the priority is getting comfortable with Linux as a daily driver, not customising it into oblivion. Fedora is giving me everything I need for development and not demanding much attention in return.

## For Now

Both Windows and Fedora are currently on this machine as a dual boot and that is probably how it stays for the foreseeable future. I am not interested in burning the bridge to Windows completely while I am still doing collaborative work that requires it.

But day to day? Fedora. Development is a breeze, the workflow is cleaner, and I do not have to think about what the OS has decided to install on my behalf. That is good enough for me.
