# Coding Style Guide

We have our own coding style, but mostly follow the general coding style guide of the Angular. The full documentation can be found from [here](https://angular.io/guide/styleguide).

Listing common issues and MUST items here to let all developers follow on their programming.

#### Style 01-01

* **Do** define one thing, such as a service or component, per file.
* **Consider** limiting files to 400 lines of code.

#### Style 01-02

* **Do** define small functions.
* **Consider** limiting to no more than 75 lines.

#### Style 04-01 - LIFT

* **Do** structure the application such that you can **L**ocate code quickly, **I**dentify the code at a glance, keep the **F**lattest structure you can, and **T**ry to be **DRY**.
* **Do** define the structure to follow these four basic guidelines, listed in order of importance.

#### Style 04-05 - T-DRY(Try to be DRY)

* **Do** be DRY (Don't Repeat Yourself).
* **Avoid** being so DRY that you sacrifice readability.

#### Style 04-07 - Folders-by-feature structure

* **Do** create folders named for the feature area they represent.
* **Do** create an NgModule for each feature area.

#### Style 04-10 - Shared feature module

* **Do** create a feature module named `SharedModule` in a shared folder; for example, `app/shared/shared.module.ts` defines `SharedModule`.
* **Do** declare components, directives, and pipes in a shared module when those items will be re-used and referenced by the components declared in other feature modules.
* **Consider** using the name `SharedModule` when the contents of a shared module are referenced across the entire application.
* **Consider** not providing services in shared modules. Services are usually singletons that are provided once for the entire application or in a particular feature module. There are exceptions, however. For example, in the sample code that follows, notice that the `SharedModule` provides `FilterTextService`. This is acceptable here because the service is stateless;that is, the consumers of the service aren't impacted by new instances.
* **Do** import all modules required by the assets in the SharedModule; for example, CommonModule and FormsModule.
* **Do** declare all components, directives, and pipes in the `SharedModule`.
* **Do** export all symbols from the `SharedModule` that other feature modules need to use.
* **Avoid** specifying app-wide singleton providers in a `SharedModule`. Intentional singletons are OK. Take care.

#### Style 04-12 - Never directly import lazy loaded folders

* **Avoid** allowing modules in sibling and parent folders to directly import a module in a lazy loaded feature.
  Why?
  Directly importing and using a module will load it immediately when the intention is to load it on demand.

#### Style 04-13 - Do not add filtering and sorting logic to pipes

* **Avoid** adding filtering or sorting logic into custom pipes.
* **Do** pre-compute the filtering and sorting logic in components or services before binding the model in templates.
  Why?
  Filtering and especially sorting are expensive operations. As Angular can call pipe methods many times per second, sorting and filtering operations can degrade the user experience severely for even moderately-sized lists.

#### Style 05-14 - Member sequence

* **Do** place properties up top followed by methods.
* **Do** place private members after public members, alphabetized.

#### Style 05-15 - Delegate complex component logic to services

* **Do** limit logic in a component to only that required for the view. All other logic should be delegated to services.
* **Do** move reusable logic to services and keep components simple and focused on their intended purpose.

#### Style 05-16 - Don't prefix output properties

* **Do** name events without the prefix on.
* **Do** name event handler methods with the prefix on followed by the event name.

#### Style 05-17 - Put presentation logic in the component class

* **Do** put presentation logic in the component class, and not in the template.

#### Style 08-01 - Talk to the server through a service

* **Do** refactor logic for making data operations and interacting with data to a service.
* **Do** make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.
