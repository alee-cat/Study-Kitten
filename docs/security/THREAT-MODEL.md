# docs/security/THREAT-MODEL.md

## Attack Surface
- POST /api/auth/register — unauthenticated, accepts email/displayName/password
- POST /api/auth/login — unauthenticated, accepts email/password
- POST /api/courses — authenticated, accepts title/professor
- GET /api/courses — authenticated, returns course title/professor
- POST /api/assignments — authenticated, accepts title/assignmentType/dueDate/completionStatus/priority
- GET /api/assignments — authenticated, returns title/assignmentType/dueDate/completionStatus/priority
- POST /api/tasks — authenticated, accepts title/description/courseIds
- GET /api/tasks — authenticated, returns course title/description/courseId
- JWT access tokens — bearer, sent in Authorization header

## STRIDE Analysis, with Risk Rating
| Component                 | Threat                                                         | Category | Likelihood | Impact | Mitigation |
|---------------------------|----------------------------------------------------------------|---|--------|---|---|
| POST /api/auth/login      | Unlimited login attempts allow brute force credential guessing | Denial of Service | Medium | High | Limit amount of attempts |
| POST /api/auth/register   | JSON object in login fields                                    | Tampering/Injection | Medium | High | Type-checking |
| POST /api/auth/login      | Login reveals if email exists                                  | Information disclosure | Medium | Medium | Return INVALID_CREDENTIALS |
| JWT tokens                | Modified payload                                               | Tampering | Medium | High | Verify with jwt.verify |
| POST and GET /api/courses | Unauthenticated access | Spoofing | Medium | High | Require Authentication |
| POST and GET /api/assignments | Accessing, editing, or deletling another user's assignment | Elevation | Low | Medium | Require a user ID |
| POST and GET /api/tasks | Joined course object leaking userId | Information disclosure | Medium | High | Remove course.userId from export |
| POST and GET /api/courses | Unlimited course creation and very large title fields | Denial of service | Medium | High | Max length |
