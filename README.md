# github-commits-since-tag-cli

Command line interface for [github-commits-since-tag](https://github.com/leesei/github-commits-since-tag).

It lists the commits of GitHub repo since the last version tag with GitHub API. Useful for checking whether we should do a release. See rationale [here](https://github.com/leesei/github-commits-since-tag#why).

## Install

```sh
npm i -g github-commits-since-tag-cli
```

## Usage

```sh
# list commits since last tag for all repos of a specific user
ghcst github
# list commits since last tag for a specific repo
ghcst github/hub
```

GitHub imposes a [per IP rate limit](https://developer.github.com/v3/#rate-limiting) on GitHub API requests, you need a [Personal access tokens](https://github.com/settings/tokens) to enjoy higher rates and access to private repo. A token with no specific role should suffice.

You can use `~/.ghcstrc` to specify user name and token:
```json
{
  "user": "GitHub username",
  "token": "GitHub token",
}
```

### Debug logs

Supported DEBUG tags: *ghcst:flow*, *ghcst:data*.  
See [visionmedia/debug](https://github.com/visionmedia/debug/) for details.
