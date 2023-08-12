describe("User Creation Flow", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3000/sign-up");
  });

  it("should create a new user successfully", async () => {
    // Fill in the user details
    await page.type("input[name=\"firstName\"]", "Test");
    await page.type("input[name=\"lastName\"]", "User");
    await page.type("input[name=\"email\"]", "testuser@example.com");
    await page.type("input[name=\"password\"]", "securepassword123");
    await page.type("input[name=\"confirmPassword\"]", "securepassword123");

    // Submit the form
    await page.click("button[type=\"submit\"]");

    await page.waitForNavigation();

    expect(page.url()).toBe("http://localhost:3000/"); 
  });
});
