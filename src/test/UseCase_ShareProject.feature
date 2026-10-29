feature: Share project
as a Registered User
I want to share a project
Scenario: Share project
  Given I am logged in
  When I go to "Share project"
  And I fill in the following:
    | Title       | Cozy autumn scarf       |
    | Description | My first cable pattern  |
  And I upload a photo
  And I press "Publish"
  Then I should see "Project shared successfully."
