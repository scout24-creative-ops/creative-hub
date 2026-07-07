/* ============================================================================
   Concept B — per-agent detail enrichment.
   Adds "When to use / When not to use / Best for" plus matched tutorials and
   examples to every agent, derived from its category with curated overrides
   for the most-used agents. Honest, scalable: no invented stats per agent.
   Attaches window.HUB.getAgentDetail(agent).
   ============================================================================ */
(function () {
  const HUB = window.HUB;

  /* Category-level guidance — genuinely useful defaults so every agent has a
     meaningful detail page even before bespoke copy is written. */
  const CAT_GUIDE = {
    create: {
      bestFor: "Getting from a brief to a usable first draft fast.",
      helps: [
        "Turn a brief into a usable first draft fast",
        "Generate on-brand variants to react to and refine",
        "Keep recurring creative work consistent",
      ],
      use: [
        "Early exploration, concepts and mood finding",
        "Generating variants you can react to and refine",
        "Internal drafts and stakeholder alignment",
        "Recurring, lower-risk assets that still need a human read",
      ],
      avoid: [
        "Final hero or high-impact brand assets without review",
        "Anything claiming facts, pricing or results",
        "A brand-new visual language or expression",
        "Legal, rights-sensitive or regulated content",
      ],
    },
    adapt: {
      bestFor: "Versioning approved work across formats and placements.",
      helps: [
        "Resize and version approved work across formats",
        "Produce a full set of placements from one master",
        "Turn around already-approved creative quickly",
      ],
      use: [
        "Resizing an approved master to channel formats",
        "Converting between formats while keeping the message",
        "Producing a set of placements from one source",
        "Fast turnaround on already-approved creative",
      ],
      avoid: [
        "Adapting work that isn't approved yet",
        "Changing the core message, look or call to action",
        "Tasks that need fresh creative judgement",
        "Final output without a contrast & safe-area check",
      ],
    },
    check: {
      bestFor: "A fast pre-flight read before a human review.",
      helps: [
        "Spot brand and consistency issues early",
        "Sanity-check a set before it goes to review",
        "Flag what needs a closer human look",
      ],
      use: [
        "Spotting brand and consistency issues early",
        "Sanity-checking a set before it goes to review",
        "Flagging what needs a closer human look",
        "Comparing output against a brief or benchmark",
      ],
      avoid: [
        "Using it as the only sign-off",
        "Judging subjective creative quality",
        "Replacing a real accessibility audit on shipped work",
        "Treating its output as a guarantee",
      ],
    },
    learn: {
      bestFor: "Getting unblocked and making outputs land on brand.",
      helps: [
        "Get better first-try results with prompting help",
        "Answer brand questions from official sources",
        "Understand a model's strengths and limits",
      ],
      use: [
        "Prompting help and better first-try results",
        "Brand questions answered from official sources",
        "Understanding a model's strengths and limits",
        "Quick guidance without leaving your flow",
      ],
      avoid: [
        "As a source of legal or factual truth",
        "Replacing the brand guidelines themselves",
        "Final decisions on sensitive topics",
        "Anything you can't verify against a source",
      ],
    },
    govern: {
      bestFor: "Keeping assets and systems consistent at scale.",
      helps: [
        "Keep libraries, tokens and icons consistent",
        "Find the approved source of truth fast",
        "Keep output aligned across teams",
      ],
      use: [
        "Managing libraries, tokens and icon systems",
        "Finding the approved source of truth",
        "Normalising metadata and surfacing best versions",
        "Keeping output consistent across teams",
      ],
      avoid: [
        "One-off creative tasks better suited to a Create agent",
        "Decisions that need a human owner's sign-off",
        "Anything outside its governed scope",
        "Replacing ownership of the system itself",
      ],
    },
  };

  /* Bespoke overrides for the agents people open most. */
  const OVERRIDES = {
    "lp-builder": {
      bestFor: "Create campaign landing pages faster with approved modules and templates.",
      helps: [
        "Create landing pages from approved modules and templates",
        "Launch campaign and seasonal pages faster",
        "Keep page structures consistent across campaigns",
      ],
      use: [
        "Building landing pages from approved modules and templates",
        "Creating campaign and seasonal page variants quickly",
        "Drafting page structure and content for review",
        "Keeping multiple pages consistent",
      ],
      avoid: [
        "Creating entirely new page patterns outside the module library",
        "Publishing without brand, legal or accessibility review",
        "Making pricing or legal claims without approval",
        "Replacing UX decisions on critical conversion flows",
      ],
    },
    "native-ad-imagery": {
      bestFor: "Creating native-style ad imagery that fits the placement and stays on brand.",
      helps: [
        "Create ad imagery that feels native to each placement",
        "Generate on-brand ad variants to test and refine",
        "Explore ad directions before production",
      ],
      use: [
        "Native-style imagery for paid social and display",
        "On-brand ad variants you can react to and refine",
        "Exploring ad directions before production",
        "Filling an ad set with on-brand candidates",
      ],
      avoid: [
        "Hero campaign assets without Creative Studio review",
        "Faces, hands and fine product detail used as final",
        "Anything implying a real property, person or claim",
        "Output shipped without a brand and accessibility read",
      ],
    },
    "is24-imagery": {
      bestFor: "Create photorealistic, on-brand marketing imagery and variants from a rough brief.",
      helps: [
        "Create photorealistic marketing imagery from a short brief",
        "Generate variants, formats and crops quickly",
        "Explore directions before a shoot or studio job",
      ],
      use: [
        "Single images, variants and formats from a short brief",
        "Recurring mailing and CRM imagery drafts",
        "Exploring directions before a shoot or studio job",
        "Filling a campaign set with on-brand candidates",
      ],
      avoid: [
        "Hero campaign assets without Creative Studio review",
        "Faces, hands and fine product detail used as final",
        "Anything implying a real property, person or claim",
        "Output shipped without a brand and accessibility read",
      ],
    },
    "illustration-extender": {
      bestFor: "Turn new briefs into on-brand illustration concepts and first drafts.",
      helps: [
        "Generate illustration concepts from a written brief",
        "Extend existing illustration styles consistently",
        "Create first drafts for review and refinement",
      ],
      use: [
        "Early exploration, concepts and mood finding",
        "Generating variants you can react to and refine",
        "Internal drafts and stakeholder alignment",
        "Recurring, lower-risk assets that still need review",
      ],
      avoid: [
        "Final hero or high-impact brand assets without review",
        "Anything claiming facts, pricing or results",
        "Creating an entirely new visual language",
        "Legal, rights-sensitive or regulated content",
      ],
    },
    "script-storyboard": {
      bestFor: "Kickstarting scriptwriting — from vague request to structured creative direction.",
      helps: [
        "Turn a business message into a clear video concept",
        "Draft scripts tailored to the audience and goal",
        "Map out a storyboard scene by scene",
        "Improve briefing quality before production starts",
      ],
      use: [
        "Kickstarting scriptwriting from a rough idea",
        "Turning vague requests into structured direction",
        "Early concepting before briefing a video team",
        "Exploring several video angles quickly",
      ],
      avoid: [
        "Final scripts without a Creative Studio review",
        "Producing the actual video (concept and script only)",
        "Legal or claim-sensitive copy without sign-off",
        "Replacing a proper creative brief for big campaigns",
      ],
    },
    "prompt-engineer": {
      bestFor: "Writing sharper prompts for image and video generation models.",
      helps: [
        "Tailor prompts to each model's rules and strengths",
        "Get more accurate, consistent results faster",
        "Learn what a model can and can't do before you start",
      ],
      use: [
        "Writing prompts for image and video models",
        "Adapting one idea across different generators",
        "Debugging a prompt that keeps missing the mark",
        "Learning a new model's strengths and limits",
      ],
      avoid: [
        "Generating final assets (it writes prompts, not images)",
        "Brand sign-off — outputs still need a review",
        "Models it hasn't been briefed on yet",
        "Replacing a proper creative brief",
      ],
    },
    "video-endcard-editor": {
      bestFor: "Adding the correct brand endcard to a finished video — no editing skills needed.",
      helps: [
        "Add the right abbinder to the end of any video",
        "Pick the correct endcard for each format automatically",
        "Skip the video-editing tool for this one common task",
      ],
      use: [
        "B2B and content videos produced for social media",
        "Finishing a video that just needs the brand endcard",
        "Teams without video-editing skills or tools",
        "Keeping endcards consistent across formats",
      ],
      avoid: [
        "Any other video editing (endcards only)",
        "Formats without a defined endcard yet",
        "Paid ad masters without a Creative Studio check",
        "Replacing proper post-production on hero content",
      ],
    },
    "image-size-adapter": {
      bestFor: "Turning one source image into a channel-ready set of formats, fast.",
      helps: [
        "Adapt source images for paid social, display and other placements",
        "Recommend the right output set before production begins",
        "Preserve products, faces, logos, headlines, CTAs and legal copy",
        "Group outputs into the smartest set of reusable compositions",
        "Flag risky formats early when a source is too constrained",
      ],
      use: [
        "Adapting an approved image for paid social and display",
        "Planning the right output set before production begins",
        "Producing a broad format set from one source creative",
        "Protecting key visual elements while recomposing",
      ],
      avoid: [
        "Creating brand-new layouts (it doesn't design from scratch yet)",
        "Adapting work that isn't approved yet",
        "Sources too low-res or constrained for a strong result",
        "Final output without a contrast & safe-area check",
      ],
    },
    "jpg-png-to-svg": {
      bestFor: "Converting a single JPG or PNG illustration into a clean, reusable SVG.",
      helps: [
        "Convert a JPG or PNG illustration into a faithful SVG",
        "Produce a transparent background with no embedded raster",
        "Create cleaner, reusable vector illustration assets",
      ],
      use: [
        "Turning a single flat illustration into vector",
        "Cleaning up raster illustrations for reuse",
        "Producing transparent-background SVGs for layouts",
        "Speeding up raster-to-vector conversion",
      ],
      avoid: [
        "Photographs or complex photographic imagery",
        "Batch conversion (one illustration at a time)",
        "Expecting pixel-perfect gradients or fine texture",
        "Final assets without a quick vector clean-up check",
      ],
    },
    "brand-channel": {
      bestFor: "Get trusted brand answers, find approved assets and route new creative requests fast.",
      helps: [
        "Get trusted answers to brand questions",
        "Find approved assets and templates faster",
        "Route creative requests into the right workflow",
      ],
      use: [
        "Brand questions answered from official sources",
        "Finding approved assets without guesswork",
        "Routing net-new creative work into the right workflow",
        "Triaging and clarifying a request before you start",
      ],
      avoid: [
        "Decisions the brand guidelines don't yet cover",
        "Treating an answer as approval to ship",
        "Sensitive or legal topics without a human owner",
        "Anything you can't trace back to a source",
      ],
    },
  };

  function detailFor(agent) {
    const cat = agent.categories[0] || "create";
    const g = CAT_GUIDE[cat] || CAT_GUIDE.create;
    const ov = OVERRIDES[agent.id] || {};
    return {
      bestFor: ov.bestFor || g.bestFor,
      helps: ov.helps || g.helps,
      whenToUse: ov.use || g.use,
      whenNotToUse: ov.avoid || g.avoid,
      tutorials: (HUB.TUTORIALS || []).filter((t) => t.agent === agent.name),
      examples: (HUB.SHOWCASES || []).filter((s) => s.agent === agent.name),
    };
  }

  HUB.getAgentDetail = detailFor;
})();
