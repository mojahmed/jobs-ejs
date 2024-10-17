const { app } = require("../app");
const { seed_db, testUserPassword, factory } = require("../util/seed_db"); // i Added factory here
const get_chai = require("../util/get_chai");
const Job = require("../models/Job");
// const jobsRouter = require("../routes/jobs");do i have to have jobs routes in this file ?
describe("Job CRUD Operations", function () {
  before(async () => {
    const { expect, request } = await get_chai();
    this.test_user = await seed_db();
    // Get CSRF token and cookie
    let req = request.execute(app).get("/sessions/logon").send();
    let res = await req;
    const textNoLineEnd = res.text.replaceAll("\n", "");
    // i fixed this line i remove the 3 of the \
    this.csrfToken = /_csrf" value="(.*?)"/.exec(textNoLineEnd)[1];
    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken")
    );
    // Log in the user
    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };
    req = request
      .execute(app)
      .post("/sessions/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );
    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });
  it("should get the job list", async () => {
    const { expect, request } = await get_chai();
    const req = request
      .execute(app)
      .get("/sessions/logon")
      //   .get("/jobs", jobsRouter)  // Adjust this path based on your routes
      .set("Cookie", [this.csrfCookie, this.sessionCookie].join("; ")) //i add this line
      .send();
    const res = await req;
    expect(res).to.have.status(200);
    const pageParts = res.text.split("<tr>");
    expect(pageParts.length).to.equal(21); // 20 jobs + header row
  });
  it("should add a new job entry", async () => {
    const { expect, request } = await get_chai();
    const newJob = await factory.build("job"); // Now factory is defined
    const dataToPost = {
      company: newJob.company,
      position: newJob.position,
      status: newJob.status,
      _csrf: this.csrfToken,
    };
    const req = request
      .execute(app)
      .post("/jobs") // Adjust this path based on your routes
      .set("Cookie", [this.csrfCookie, this.sessionCookie].join("; ")) /// do i have to add only one time with get or post
      .set("content-type", "application/x-www-form-urlencoded", )
      .send(dataToPost);
    const res = await req;
    expect(res).to.have.status(200);
    // Verify the job was added
    const jobs = await Job.find({ createdBy: this.test_user._id });
    expect(jobs.length).to.equal(21); // Verify the count
  });
});