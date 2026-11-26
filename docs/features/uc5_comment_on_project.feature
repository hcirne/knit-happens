@wip
Feature: Comment on project
  As a registered user
  I want to comment on a shared project
  So that I can give feedback to its creator

  Background:
    Given I am logged in as a registered user
    And I am viewing a project

  Scenario: Post a comment successfully
    When I write "Love the colors!" in the comment field
    And I press "Post"
    Then my comment should be saved
    And I should see my comment under the project

  Scenario: The comment is empty
    When I leave the comment field empty
    And I press "Post"
    Then I should see a validation error
    And no comment should be saved

  Scenario: The project was removed in the meantime
    Given the project was removed by its creator
    When I write "Love the colors!" in the comment field
    And I press "Post"
    Then I should see an error that the project no longer exists
    And no comment should be saved
