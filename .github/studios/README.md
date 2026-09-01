# Registered Studios and ownership

This registry records Studio assignments in GitHub without publishing their shells on the Creative Hub webpage.

| Studio | Owner | GitHub | Scope | Status |
| --- | --- | --- | --- | --- |
| Motion Studio | Henrik | [`ScoutBoyDesign`](https://github.com/ScoutBoyDesign) | Motion guidelines | Planned |
| One System Studio | Alex | [`alexpenk`](https://github.com/alexpenk) | Brand, Assets and One System Studio | Planned |
| Professionals Studio | Peter | [`PeterSijtsma`](https://github.com/PeterSijtsma) | Professionals and professional products | Planned |
| Homeowner Studio | Nadja | [`ndc4scout24`](https://github.com/ndc4scout24) | Homeowner products | Planned |
| Seeker Studio | Marcus | [`md-at-is24`](https://github.com/md-at-is24) | Seeker products | Planned |
| Sprengnetter Studio | Eve | [`evevogelein-s24`](https://github.com/evevogelein-s24) | Sprengnetter products, News and Brand | Planned |

After accepting a repository invitation, each owner can clone the repository and generate their registered environment:

```sh
node .github/studio-template/create-studio.mjs motion-studio
node .github/studio-template/create-studio.mjs one-system-studio
node .github/studio-template/create-studio.mjs professionals-studio
node .github/studio-template/create-studio.mjs homeowner-studio
node .github/studio-template/create-studio.mjs seeker-studio
node .github/studio-template/create-studio.mjs sprengnetter-studio
```

The generator reads owner, name, purpose and scope from `registry.json`. Generated environments remain inside the ignored `.studio-workspaces/` directory.

Repository access is managed by GitHub administrators. Entries in this registry document responsibility but do not themselves grant repository permissions.
