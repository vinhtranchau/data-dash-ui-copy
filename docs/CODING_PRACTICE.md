# Coding Practices

### Write useful comments

Comments that explain what some block of code does are nice; they can tell you something in less time than it would take to follow through the code itself.

Comments that explain why some block of code exists at all, or does something the way it does, are invaluable. The "why" is difficult, or sometimes impossible, to track down without seeking out the original author. When collaborators are in the same room, this hurts productivity. When collaborators are in different timezones, this can be devastating to productivity.

For example, this is a not-very-useful comment:

```typescript
// Set default tabindex.
if (!attributes['tabindex']) {
  element.setAttribute('tabindex', '-1');
}
```

While this is much more useful:

```typescript
// Unless the user specifies otherwise, the calendar should not be a tab stop.
// This prevents ngAria from overzealously adding a tabindex to anything with an ng-model.
if (!attributes['tabindex']) {
  element.setAttribute('tabindex', '-1');
}
```

In TypeScript code, use JsDoc-style comments for descriptions (on classes, members, etc.) and use // style comments for everything else (explanations, background info, etc.).

### Optional arguments

Use optional function arguments only when such an argument makes sense for an API or when required for performance. Don't use optional arguments merely for convenience in implementation.

### Try-Catch

Only use try-catch blocks when dealing with legitimately unexpected errors. Don't use try to avoid checking for expected error conditions such as null dereference or out-of-bound array access.

Each try-catch block must include a comment that explains the specific error being caught and why it cannot be prevented.

### Observables

Don't suffix observables with `$`.

### Methods

The name of a method should capture the action performed by that method rather than describing when the method will be called. For example:

```typescript
/** AVOID: does not describe what the function does. */
handleClick() {
  // ...
}

/** PREFER: describes the action performed by the function. */
activateRipple() {
  // ...
}
```
