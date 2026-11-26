Feature: Backend health
  Smoke test that proves the Cucumber + Spring + Testcontainers wiring works.

  Scenario: The health endpoint answers
    When I request GET "/api/health"
    Then the response status is 200
    And the JSON field "status" is "ok"
