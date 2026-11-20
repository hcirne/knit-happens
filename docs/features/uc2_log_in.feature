Feature: Log in
  As a registered user
  I want to log in to my account
  So that I can share projects and comment

  Background:
    Given I am not logged in
    And I am on the "Log in" page

  Scenario: Log in successfully
    Given an account with the email "knitter@example.com" exists
    When I enter the email "knitter@example.com"
    And I enter my correct password
    And I press "Log in"
    Then I should be logged in
    And I should see the home page

  Scenario: The credentials are wrong
    Given an account with the email "knitter@example.com" exists
    When I enter the email "knitter@example.com"
    And I enter a wrong password
    And I press "Log in"
    Then I should see a login error
    And I should not be logged in

  Scenario: A field is left empty
    When I enter the email "knitter@example.com"
    And I leave the password empty
    And I press "Log in"
    Then the system should mark the missing field
    And I should not be logged in
