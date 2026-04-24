# Project Compaction Specification

## Purpose

Enable users to consolidate multiple projects into a single project using the existing `/projects/migrate` API.

## Requirements

### Requirement: Modal Display

The system SHALL display a "Compact Projects" tab within the CompactModal.

#### Scenario: Display compact projects tab

- GIVEN the user has opened the Compact modal
- WHEN the user clicks the "Compact Projects" tab
- THEN the system SHALL display a list of available projects with checkboxes

#### Scenario: Project list shows counts

- GIVEN the user is on the "Compact Projects" tab
- WHEN projects are displayed
- THEN each project SHALL show session count and observation count

### Requirement: Target Project Name Input

The system SHALL require a non-empty target project name before enabling the compact action.

#### Scenario: Valid target project name

- GIVEN the user has selected one or more projects
- WHEN the user enters a non-empty target project name
- THEN the "Compact Projects" button SHALL become enabled

#### Scenario: Empty target project name

- GIVEN the user has entered an empty target project name
- THEN the "Compact Projects" button SHALL remain disabled

### Requirement: Preview Panel

The system SHALL display a preview showing selected project counts before compaction.

#### Scenario: Preview updates on selection

- GIVEN the user has selected projects
- WHEN the selection changes
- THEN the preview panel SHALL update to show the count of selected projects

### Requirement: Project Compaction via Merge

The system SHALL use the existing `mergeProjects()` function from engramService to compact projects.

#### Scenario: Successful project compaction

- GIVEN the user has selected multiple projects and entered a target name
- WHEN the user clicks "Compact Projects"
- THEN the system SHALL call `mergeProjects(source, target)` for each selected source project
- AND the target project SHALL contain observations from all source projects
- AND the system SHALL display a success message

#### Scenario: API failure during migration

- GIVEN the user has initiated project compaction
- WHEN `mergeProjects()` fails for a source project
- THEN the system SHALL display an error message
- AND remaining project migrations SHALL still be attempted

#### Scenario: Empty selection

- GIVEN the user has not selected any projects
- THEN the "Compact Projects" button SHALL be disabled

### Requirement: No Warning Required

Project compaction SHALL NOT require a destructive warning because it uses non-destructive merge API behavior (observations are moved, not recreated).

#### Scenario: No warning displayed

- GIVEN the user is on the "Compact Projects" tab
- THEN no destructive operation warning SHALL be displayed

### Requirement: Localization

The system SHALL display success messages in the user's current locale.

#### Scenario: Success message display

- GIVEN compaction completes successfully
- THEN the success message SHALL be displayed in the user's locale
- AND SHALL show count of projects migrated