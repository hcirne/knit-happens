Feature: Create account
  As a visitor
  I want to create an account
  So that I can share projects and comment

  Background:
    Given I am not logged in
    And I am on the "Create account" page

  Scenario: Create an account successfully
    When I enter the email "knitter@example.com"
    And I enter the username "woolwizard"
    And I enter a valid password
    And I press "Create account"
    Then the system should create my account
    And I should see a confirmation message

  Scenario: The email is already used
    Given an account with the email "knitter@example.com" exists
    When I enter the email "knitter@example.com"
    And I enter the username "newknitter"
    And I enter a valid password
    And I press "Create account"
    Then I should see an error that the email is already used
    And no new account should be created

  Scenario: The entered data is invalid
    When I enter the email "not-an-email"
    And I enter the username "woolwizard"
    And I enter a valid password
    And I press "Create account"
    Then I should see a validation error
    And no new account should be created
