# Git

### Branch names

When you work on an issue (from GitHub), create a new branch with the following format: ```DC-123-ticket-title```, where 123 is the ticket number from Jira and description can be anything short that identifies your work textual. The reason for the text is that it is not always easy to keep all the issue numbers in mind, so a short text helps to understand what the branch is about.

Example: ```DC-273-build-internal-face-crud-fronten```

### Commit messages

For commit messages, we use the following format:

```
feat: short description of change
 * detailed description 1
 * detailed description 2
```

It is important to mention the GitHub issue number in the commit message so that it is also linked / visible in the issue on GitHub for reference. More detailed introduction can be found from the [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## IDE

### Format / Organize imports

Setup your IDE to automatically format the code / source files. Also use the existing code format, which is usually checked in along with the source code, or checking the code format you use if it does not exist in the repository yet.

It is important that we all use the same code format so that change sets in pull requests and commits only contain the actual changes and not lines that only changed in formatting.
