# About pull requests

Pull requests let you tell others about changes you've pushed to a branch in a repository on GitHub. Once a pull request is opened, you can discuss and review the potential changes with collaborators and add follow-up commits before your changes are merged into the base branch.

We have a strict rule and our own culture for the pull requests.

## Branch protection rules
You are supposed not-able-to push code directly to the `master` branch. Creating pull requests is the only way to submit your work to the main branch.

- `master` branch is the main branch and will be protected
- PR should be up-to-dated to be merged
- All pipeline checks should be passed
- At least 1 approval is required

## Get started
[The default pull request template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository) is already built and there on each repository. At the moment, GitHub not supporting the global template for the organization, we did copy-paste templates to repositories.

To review everything in detail, please check the root of each repository, `.github` folder, `pull_request_template.md` file.

## Requirements

### When should I create a pull request?

We are using [Jira](https://stableprice.atlassian.net/browse/) for the ticket management, and we are creating pull requests for each ticket. Sometimes if you need to submit quick change or bug fix which is urgent, you can create a pull request without any ticket, but ticket based pull requests are always recommended.

When you start on a new ticket, you are creating your own branch under the name e.g - `DC-200-Decision-feature-implementation`, and push your commits on that branch. While working on it, you can create a [draft pull request](https://github.blog/2019-02-14-introducing-draft-pull-requests/), after finishing all, you can convert that draft as a ready for review status.

### Title
Please set the title as below format:
```
[DC-XXX] - Ticket title or brief summary of the pull request

# Example: [DC-4] - Build internal facing APIs for CRUD frontend
```

### Labels
There must be at least two labels attached to the pull requests, types and priority.
```
# Example: enhancement, priority::high
```

### Assignees and Reviewers
You are setting yourself as an assignee of the pull request. And at least 1 reviewer should be selected, because of the branch protection rule, you are not allowed to merge your pull request until it get approved.

