package com.knithappens.steps;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/** Steps for features/smoke/health.feature. Uses MockMvc, so no real HTTP port is needed. */
public class HealthSteps {

    private final MockMvc mockMvc;

    // The last response, shared by the Then steps of the same scenario.
    private ResultActions response;

    @Autowired
    public HealthSteps(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    @When("I request GET {string}")
    public void iRequestGet(String path) throws Exception {
        response = mockMvc.perform(get(path));
    }

    @Then("the response status is {int}")
    public void theResponseStatusIs(int expected) throws Exception {
        response.andExpect(status().is(expected));
    }

    @Then("the JSON field {string} is {string}")
    public void theJsonFieldIs(String field, String expected) throws Exception {
        response.andExpect(jsonPath("$." + field).value(expected));
    }
}
