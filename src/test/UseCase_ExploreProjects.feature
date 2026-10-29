Feature: Explore projects
  As a user
  I want to browse shared projects
  So that I can find inspiration for my next knitting project

  Scenario: Browse the feed and open a project
    Given there are shared projects
    When I open the project feed
    Then I should see project cards with photo, title and creator
    When I select a project
    Then I should see the project details

  Scenario: The feed is empty
    Given there are no shared projects
    When I open the project feed
    Then I should see an empty-state message

  Scenario: A visitor can browse without logging in
    Given I am not logged in
    And there are shared projects
    When I open the project feed
    Then I should see project cards with photo, title and creator
