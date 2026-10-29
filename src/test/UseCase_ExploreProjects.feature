feature: Explore Projects
as a Registered User
I want to explore projects
Scenario: Explore projects
  Given there are shared projects
  When I go to the project feed
  And I select a project
  Then I should see the project details
