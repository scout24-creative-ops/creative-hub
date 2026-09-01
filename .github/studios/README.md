# Registered Studios and ownership

This registry records Studio assignments in GitHub without publishing their shells on the Creative Hub webpage.

| Studio | Owner | GitHub | Scope | Status |
| --- | --- | --- | --- | --- |
| Motion Studio | Henrik | [`ScoutBoyDesign`](https://github.com/ScoutBoyDesign) | Motion guidelines | Planned |
| One System Studio | Alex | [`alexpenk`](https://github.com/alexpenk) | Brand, Assets and One System Studio | Planned |
| Professionals Studio | Peter | [`PeterSijtsma`](https://github.com/PeterSijtsma) | Professionals and professional products | Planned |

After accepting a repository invitation, each owner can clone the repository and generate their registered environment:

```sh
node .github/studio-template/create-studio.mjs motion-studio
node .github/studio-template/create-studio.mjs one-system-studio
node .github/studio-template/create-studio.mjs professionals-studio
```

The generator reads owner, name, purpose and scope from `registry.json`. Generated environments remain inside the ignored `.studio-workspaces/` directory.

Repository access is managed by GitHub administrators. Entries in this registry document responsibility but do not themselves grant repository permissions.
