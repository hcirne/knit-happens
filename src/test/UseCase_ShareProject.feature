Feature: Share project
  As a Registered user
  I want to publish a finished knitting project with photos and a description
  So that the community can see it in the feed

  Background:
    Given I am logged in as a registered user
    And I am on the "Share project" page

  Scenario: Share a project successfully
    When I enter the title "Cozy Winter Scarf"
    And I enter the description "My first cable pattern"
    And I upload a valid photo
    And I press "Publish"
    Then the system should save the project
    And I should see "Cozy Winter Scarf" in the project feed

  Scenario: Required fields are missing
    When I enter the title "Cozy Winter Scarf"
    And I leave the description empty
    And I upload a valid photo
    And I press "Publish"
    Then the system should mark the missing fields
    And the project should not be saved

  Scenario: Photo upload is invalid
    When I enter the title "Cozy Winter Scarf"
    And I enter the description "My first cable pattern"
    And I upload a file that is not a valid photo
    And I press "Publish"
    Then I should see an upload error
    And the project should not be saved
