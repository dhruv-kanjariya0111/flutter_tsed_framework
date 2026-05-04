# Product Requirements Document

## Project
- Name: TaskFlow
- Description: A task management app for small teams
- Platforms: both

## Backend
- Type: tsed
- Auth strategy: jwt
- Backend access locally: yes

## Roles
- User roles: admin, user

## Features

### Feature 1: User Login
- Description: Email and password login with JWT
- Priority: must-have
- User role: admin, user
- Acceptance criteria:
  - [ ] Login with email + password
  - [ ] JWT stored in FlutterSecureStorage
  - [ ] Error shown on wrong credentials

### Feature 2: Task Dashboard
- Description: List of tasks assigned to the user
- Priority: must-have
- User role: user
- Acceptance criteria:
  - [ ] Shows open tasks
  - [ ] Shows completed tasks

### Feature 3: Dark Mode
- Description: System-level dark mode toggle
- Priority: nice-to-have
- User role: admin, user
- Acceptance criteria:
  - [ ] Follows system setting

## Non-Functional Requirements
- Offline support: no
- i18n / localization: yes
- Analytics: yes

## External Services
- Sentry

## Project Management
- Jira: yes
- Jira project key: TASK
- Jira URL: https://taskflow.atlassian.net
