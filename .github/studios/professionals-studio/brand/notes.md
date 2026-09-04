# Professionals brand usage notes

Professionals keeps the master brand system and the established Studio workflow. The deliberate differences are the Agents tone of voice, `color.professionals.blue` as the journey accent, and the absence of a standalone product symbol. Exact values live in [tokens.json](./tokens.json); use token names rather than introducing raw values.

## Colour hierarchy

- Keep `color.neutral.white` and `color.surface.sand` dominant as surfaces.
- Use `color.brand.teal` as the main ImmoScout24 brand colour and for navigation, confirmation and positive brand moments.
- Use `color.professionals.blue` as the Professionals accent for one deliberate focus or journey-identification moment.
- Use `color.neutral.charcoal` for text, strong contrast and the default primary action.
- Use only one dominant accent field per layout. The second accent remains supporting.
- A brand gradient may blend `color.brand.teal` and `color.professionals.blue` once per layout. Keep text on that gradient in `color.neutral.charcoal`.
- Do not introduce additional hues, tints or borrowed journey colours.

## Hierarchy and typography

- Use `fontFamily.headline` and `fontFamily.body` across every Professionals product surface. Do not introduce another typeface.
- Apply the display, headline, subline, body and caption roles from `fontSize.*` and `fontWeight.*`.
- Reserve `fontWeight.h1` for the single main page heading. Every other heading uses `fontWeight.display` or `fontWeight.subline`; body copy uses `fontWeight.body`.
- Keep the headline as the sole dominant text element and within `copyLimit.headlineWordsMax`.
- Respect `fontSize.minimumAdHeadline`, `fontSize.minimumAdBody` and `fontSize.minimumWebBody`.
- Keep display leading within `lineHeight.displayMin` and `lineHeight.displayMax`; use `lineHeight.body` for body copy.
- Use sentence case. Do not use ALL CAPS or Title Case for headlines.
- Do not use dash punctuation in interface or customer copy. Rewrite the sentence with a full stop, comma or conjunction.
- An approved `highlighter.asset.*` may sit behind or beneath one focal word or phrase. Keep the irregular artwork visible and the text readable; do not substitute a generic rectangle, chip or browser effect.
- Text may sit directly on photography only when a full-edge contrast gradient makes every mark readable; never add a local text panel.

## Tone of voice

- Anchor Professionals communication in `copy.claim.mehr` and its “Mehr …” rhythm. Use the full approved claim as written whenever an umbrella statement is needed.
- Adapt the claim only when the brief supplies a concrete benefit: keep every beat starting with “Mehr” and keep the message directed to `copy.address.b2b`.
- Write in all five approved qualities under `copy.tone.*`: professional, collaborative, approachable, engaged and supportive.
- Address B2B audiences with `copy.address.b2b` throughout the journey, not only at first contact. Use the corresponding formal possessive and dative forms.
- Name the audience with `copy.audienceTerm.immobilienProfis` or `copy.audienceTerm.maklerProfis`. These are the approved gender-neutral forms for this context; do not substitute “Makler:innen”.
- Keep sentences between `copyLimit.sentenceWordsMin` and `copyLimit.sentenceWordsMax`, with one idea per sentence.
- Prefer active voice, strong verbs, precise terms and everyday language.
- Avoid marketing clichés, filler words, unexplained jargon, vague superlatives, complex metaphors, unnecessary repetition and exclamation marks.
- Read customer copy aloud before approval. Rewrite anything that does not sound natural.
- The linked Professionals writing agent is an approved drafting aid. Its internal configuration was not accessible during this source scan, so do not treat unverified agent output as a new rule; check every draft against this file and obtain human approval.

## Target groups

- Prioritise `audience.primary.*`: Real Estate Agencies, Property Developers & New Construction Companies, Property Management Companies, and Mortgage & Financing Providers.
- Use `audience.secondary.*` when the brief explicitly addresses Institutional Real Estate Companies or Real Estate Service Providers.
- Write to one segment and one buying role from `audience.decisionMakers` at a time. Do not combine all target groups in one asset.
- For agencies, lead with seller/buyer leads, premium property marketing, visibility, digital efficiency or growth.
- For developers, lead with early qualified buyer reach, project marketing, sales-cycle leads, visibility or reporting.
- For property managers, lead with tenant acquisition, vacancy reduction, digital rental processes, portfolio marketing or operational efficiency.
- For financing providers, lead with qualified financing leads, customer acquisition, digital lead generation or visibility at the right journey moment.
- For institutional companies, lead with portfolio marketing, tenant acquisition, vacancy management, market intelligence or scalable solutions.
- For service providers, lead with access to real-estate professionals, awareness, lead generation or strategic partnerships.
- Choose one supported motivation from `audience.buyingMotivations`; never promise a quantitative result without campaign evidence.

## Copy structure

- Claim: use `copy.claim.mehr`, or a supported adaptation that preserves the repeated “Mehr …” construction and formal address.
- Headline: one business benefit, no more than `copyLimit.headlineWordsMax`. The exact value of `copy.claim.mehr` is the approved exception to that general limit.
- Subline: one sentence of proof for the headline; do not introduce a second benefit.
- CTA: a verb phrase between `copyLimit.ctaWordsMin` and `copyLimit.ctaWordsMax`; formal, sentence case and without terminal punctuation.
- Email subject: benefit first and no more than `copyLimit.emailSubjectCharactersMax`.
- Use the approved vocabulary: `copy.audienceTerm.*`, listings, properties, visibility, professional presence, qualified contacts, leads, connected tools, efficient marketing, transactions and added value.
- Treat campaign performance, legal and product-feature claims as `TO CONFIRM` unless the brief supplies an approved source.

## Logo

- Use only the six supplied files under `logo.asset.horizontal` and `logo.asset.vertical`.
- Use the standard master on light or accent surfaces. On every dark background, use `logo.usage.darkBackground.horizontalAsset` or `logo.usage.darkBackground.verticalAsset`: the Immo shape remains `color.brand.teal` and “Scout24” uses `logo.usage.darkBackground.scout24Color`. Never place the standard dark-lettered master on a dark surface.
- The supplied white variant is not an all-white logo: it has a White Immo shape and Charcoal “Scout24”. Use it only on `color.professionals.blue`. Never place it on `color.neutral.white` or `color.brand.teal`, and never use it instead of the inverse master on a dark background.
- Keep logo height at or above `logo.minimum.digitalHeight` in digital work and `logo.minimum.printHeight` in print.
- Apply `logo.container.backplate`: the value is `none`. The logo sits directly on the composition and never inside a box, card, pill, plate or holding shape.
- Do not redraw, typeset, recolour, stretch, crop, rotate or add effects to the logo.
- Do not add a product symbol, cross, badge or newly typeset Professionals lockup.
- Logo clear-space measurement and fixed placements outside `logo.placement.a4_3` remain `TO CONFIRM`.

## Professionals highlighters

- Use only the ten supplied shapes under `highlighter.asset.*`. Keep each SVG unchanged as the artwork master.
- Recolour a highlighter only with `highlighter.color.teal`, `highlighter.color.blue`, `highlighter.color.white` or `highlighter.color.sand`.
- Use one highlighter as the focal gesture in a composition: underline a word, point to an object or CTA, show upward movement, or confirm one action.
- Keep the original silhouette and aspect ratio. Crop only when the approved composition clearly continues the gesture beyond the edge.
- Use White or Sand highlighters only on a dark or photographic surface with sufficient contrast.
- Highlighters support the message. They never replace the logo, CTA, product proof or Professionals identity.
- Do not repeat them as a pattern, build decorative confetti, invent new shapes, add effects or use an unapproved colour.

## Buttons and CTAs

- Use ButtonRounded with `cornerRadius.buttonRounded`.
- Use filled for the primary action and outlined with `borderWidth.buttonOutlined` for the secondary action.
- `color.neutral.charcoal` is the default filled button with a `color.neutral.white` label. Teal, Blue, White and Sand fills take a Charcoal label.
- White and Sand fills need a hairline boundary on a light surface.
- Use one filled button per view. An outlined button appears only as the second choice beside a filled button.
- Medium is the default size. Large is for landing-page heroes and final CTA blocks. Small is desktop-only and must not fall below `safeZone.minimumTouchHeight`.
- No weak fills, text buttons, elevated buttons, danger or success variants. No gradients, shadows or icons in the label.

## Image treatment

- Search the supplied Professionals imagery first. Use a relevant file from `imagery.example.*` before requesting a new image, generating an image or leaving a placeholder.
- The current supplied package is reference imagery, not a blanket production-approved library. Keep the selected file visible and traceable, then require human approval; the user will add the final approved asset set later.
- Make the subject professional yet approachable: competent and authentic, never overly polished, posed or staged.
- Prefer genuine interactions and expressions. Show agents with clients, conducting property tours or working with relevant tools.
- Use recognisable German offices, apartments and houses. Keep work props such as laptops, notebooks and coffee cups subtle; they support the scene and never dominate it.
- Keep lighting slightly warm, soft and diffused. In real offices, balance ambient light with soft adjustable light. Avoid harsh light.
- Maintain subtle contrast between subject and background. Keep backgrounds clean, lightly textured or softly blurred.
- Eye level is the default perspective for authenticity. Mix wide shots for workplace context with close portraits for individual professionals. A slightly higher viewpoint may convey approachability and authority; a lower viewpoint may suggest strength and leadership.
- Preserve negative space at the sides for approved copy, logo and graphic elements. Crop for the required format without removing the professional context.
- Use `cornerRadius.mediaMin` to `cornerRadius.mediaMax` for photo blocks and inset media.
- Make only light adjustments to exposure, contrast and colour balance. Use cohesive, subtle grading; never use heavy filters, oversaturation or unnatural effects.
- Organise source material under the Figma categories Work, Portrait, Props, Listing, Additional Business, Moments and Compositions.
- The previews recorded in `imagery.example.*` come from the supplied package and meet the written B2B criteria; they do not prove that every file in that package is approved.
- Licensed stock must cover paid advertising in the campaign territory; retain the licence reference. Final asset selection and licensing remain `TO CONFIRM`.
- AI imagery is allowed only when it looks natural, contains no text or third-party brand, keeps its prompt, follows platform disclosure rules and receives human review.

## Layouts and formats

- Assemble every asset from a clear field, one headline, one CTA, one approved logo and optionally one photograph or one approved `highlighter.asset.*`.
- Treat the fourteen files in `Assets/reference/general-approved-2026-09-04` as approved composition references. Their supported families are full-bleed portrait, editorial split, image-over-copy, image-under-copy, colour-only statement, angled image/field divisions, oversized cropped type and text-friendly negative space.
- Transfer the composition principle only. The flattened reference file itself is not an editable Professionals master and must not be placed inside a new asset.
- Replace any purple or yellow graphic treatment visible in a general reference with a suitable token from `color.brand.teal`, `color.professionals.blue`, `color.neutral.charcoal`, `color.neutral.white` or `color.surface.sand`.
- Rewrite all reference copy for the selected Professionals audience and business need. Never carry Plus terminology, Plus symbols, informal `Du/Dir/Deine` language or consumer-journey messaging into the asset.
- Keep every customer-facing line in sentence case even when the reference uses vertical or oversized all-caps typography. Layout direction may transfer; capitalisation may not.
- Landing pages use `format.landingContentWidth`, with copy left, visual right, one accent surface and the same CTA repeated at the end.
- Email uses `format.emailWidth`, a Sand body, a White card, solid colours and one primary CTA.
- Paid social uses `format.socialStory`, `format.socialPortrait` and `format.socialSquare`.
- Keep the top `safeZone.socialStoryTop` and bottom `safeZone.socialStoryBottom` of Story/Reel assets free of essential content.
- Display headlines stay within two lines; the logo remains visible. The smallest display format is logo-only.
- Native placements receive a photo-led image without baked-in copy; the platform headline field carries the message.
- Compact banners follow logo → one-line benefit → CTA and respect `safeZone.minimumTouchHeight`.

## Prohibited choices

- No standalone product symbol, cross, badge, decorative circle, blob or floating shape.
- No purple or yellow graphic colour in Professionals assets, including colours copied from an approved general reference.
- No all-caps customer-facing headline, subline, CTA, label or proof point.
- No altered, repeated or newly drawn highlighter and no highlighter colour outside `highlighter.color.*`.
- No Professionals Blue replacing Teal as the master brand colour.
- No logo backplate or reconstructed logo.
- No unapproved colour, typeface, button variant, image treatment or layout family.
- No unsubstantiated performance, product or legal claim.

## Human approval check

Before export, verify the approved logo file and direct placement, colour hierarchy, highlighter asset and colour, typography role and minimums, Agents tone of voice, copy limits, imagery source and treatment, format dimensions, safe zones, CTA hierarchy, legal requirements and claim evidence. Escalate any item still marked `TO CONFIRM`.
