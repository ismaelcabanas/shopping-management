# AI Feedback and Rule Refinement Cycle

## 1. Introduction / Problem

**Problem:** The AI's understanding of project-specific nuances, conventions, and user preferences can benefit from explicit feedback. Without a systematic process, valuable insights from user interactions might not be captured and integrated into the AI's guiding principles (i.e., the Development Rules in `.agents/rules/`).

**Purpose:** This rule establishes a mandatory process for the AI to:
* Actively learn from user feedback, guidance, and suggestions.
* Proactively identify opportunities to enhance existing Development Rules based on these learnings.
* Ensure that the AI's assistance remains aligned with evolving project needs and user expectations.
* Maximize the value of user feedback by incorporating it into the AI's operational framework.

**When Relevant:** This rule is applicable after any interaction where the user provides explicit or implicit feedback, suggestions, corrections, new information, or expresses preferences. **The AI MUST actively analyze all user interactions for such learning opportunities, not only passively waiting for direct feedback, to proactively refine its understanding and the project's best practices.**

## 2. Implementation Steps: The Feedback Loop

Upon receiving feedback or guidance from the user, the AI MUST follow these steps:

### 1. Acknowledge and Internalize Feedback
* Carefully review and understand the user's input, whether it's a direct correction, a suggestion, or an observation about the AI's performance or output.

### 2. Analyze for Actionable Learnings
* Reflect on the interaction. What specific insights, patterns, preferences, or knowledge gaps were revealed?
* Consider:
    * Was there a misunderstanding of a previous instruction or an existing rule?
    * Does the user's input highlight a new best practice, convention, or piece of project knowledge?
    * Is there an opportunity to clarify or improve an existing rule to prevent similar misunderstandings in the future?
    * Could an existing rule be made more specific or comprehensive based on this new information?
    * **Did the interaction involve modifying a document, and if so, was relevant metadata (e.g., `last_updated` date, `version` number, changelogs) also considered for updates according to established documentation standards?**

### 3. Review Existing Development Rules for Relevance
* Review the contents of `.agents/rules/base.md`, `testing.md`, `architecture.md`, and other relevant rule files.
* Identify if any existing rule(s) are directly or indirectly related to the feedback received and the learnings derived.
* Determine if an update to one or more rules could codify the new learning, making future AI assistance more accurate or helpful.

### 4. Formulate and Propose Rule Update(s) (If Applicable)
If a relevant rule can be improved or a new clarification is needed:

* **Clearly state to the user which rule(s) you propose to update.**
* **Quote the specific section(s) or line(s) of the rule that would be affected.**
* **Present the exact proposed change (e.g., new wording, additions, deletions).** Use a diff format if it aids clarity for substantial changes.
* **Explain *why* this change is being proposed and how it incorporates the learning from the user's recent feedback.** Crucially, explicitly link the proposal back to the specific user feedback or interaction that prompted this learning. Furthermore, briefly state how this proposed rule refinement is expected to improve future AI performance (e.g., enhancing accuracy, ensuring greater consistency with project goals, improving adherence to specific quality standards).
    * Example: "Based on your feedback on [date/time] regarding [briefly describe the feedback, e.g., 'the need for stricter TDD enforcement'], I've identified an opportunity to improve `base.md` section [X]. This change should help the AI consistently apply correct TDD practices in future development."

* **Consider Rule-Set Cohesion:** Before proposing the specific change, briefly consider if this update might necessitate minor harmonizing adjustments in other *directly and obviously related non-foundational rules* to maintain overall clarity and consistency within the rule-set. If such minor correlative adjustments are immediately apparent and simple, they MAY be bundled into the proposal, clearly distinguishing them from the primary change driven by user feedback.

* **Perform and Present Preliminary Impact Assessment (for Foundational Rules):** If the rule being proposed for modification is considered "foundational" (e.g., `base.md`, `testing.md`, `architecture.md` or other core development rules), the AI **MUST** also:
    1. Briefly analyze and state potential direct impacts or necessary correlative adjustments in other *known, directly related* rules or core project documents (like `CLAUDE.md`, `README.md`).
    2. Present this as a concise impact summary. For example: "If this change to `base.md` section [X] is approved, it might necessitate adjustments in section [Y] to maintain consistency regarding [specific concept], and we should also review `README.md`'s section on [related topic] to ensure continued alignment."
    3. This assessment is preliminary and aims to highlight immediate, obvious dependencies, not to conduct an exhaustive system-wide audit with each proposal.

* **Explicitly state: "I will await your review and approval before making any changes to the rule(s)."**

### 5. Await Explicit User Approval
* **DO NOT** modify any rule file(s) until the user explicitly reviews the proposal and gives clear approval to proceed with the specific changes.

### 6. Apply Approved Changes and Confirm
* If the user approves the proposed update(s), use the appropriate tool to edit the target rule file(s) precisely as agreed.
* After the update is applied, confirm to the user: "The [Rule Name].md has been updated as per your approval."

## 3. Real-World Examples

### Example 1: Improving Test Display Practices
**Scenario:** While working on a feature, the user noticed that the AI was showing multiple test files at once, which made the conversation harder to follow. The user provided feedback: "Please show only one test at a time - it's easier to follow the conversation."

**Feedback Loop in Action:**
1. **Learning:** The AI learned that displaying multiple tests simultaneously creates confusion and that a "one test at a time" approach improves clarity and focus.
2. **Rule Review:** The AI identified that `testing.md` section on "Test Process & Output" was relevant.
3. **Proposal:** The AI proposed: "Based on your feedback about showing only one test at a time, I've identified an opportunity to strengthen `testing.md`. The 'Test Process & Output' section mentions 'Single Test Display: Only show one test at a time', but I suggest we make this more explicit and add emphasis. This change should help the AI maintain better focus and clarity in all test-driven development conversations. I will await your review and approval."
4. **Approval:** The user reviewed and approved the changes.
5. **Update:** The AI updated `testing.md` accordingly, reinforcing the "one test at a time" principle.

### Example 2: Clarifying Architecture Boundaries
**Scenario:** The user corrected the AI: "Don't import React hooks in the Application layer - that violates Clean Architecture principles. Hooks belong in the Presentation layer."

**Feedback Loop in Action:**
1. **Learning:** The AI learned that React hooks specifically should never appear in the Application layer, even though they're commonly used for state management.
2. **Rule Review:** The AI identified that `architecture.md` section on "Layer Responsibilities" could be more explicit about framework-specific code placement.
3. **Proposal:** The AI proposed: "Based on your correction regarding React hooks in the Application layer, I propose adding a specific anti-pattern to `architecture.md` under 'Anti-Patterns to Avoid'. This would explicitly state that React hooks (useState, useEffect, etc.) must never be imported in Application or Domain layers. This should prevent similar violations in the future."
4. **Approval:** The user approved the change.
5. **Update:** The AI updated `architecture.md` with the new anti-pattern example.

### Example 3: Testing Standards Enhancement
**Scenario:** During code review, the user mentioned: "We should always mock external services in unit tests, but use real implementations for integration tests."

**Feedback Loop in Action:**
1. **Learning:** The AI learned about the project's specific approach to mocking in different test types.
2. **Rule Review:** The AI identified that `testing.md` section on "Testing Strategy Distinction" could be enhanced.
3. **Proposal:** The AI proposed: "Based on your guidance about mocking strategies, I suggest adding explicit rules to `testing.md` under each test type section: (1) Unit tests must mock all external dependencies, (2) Integration tests should use real implementations where practical. This would help maintain consistency across the test suite."
4. **Approval:** The user approved with minor wording adjustments.
5. **Update:** The AI updated `testing.md` with the refined mocking guidelines.

## 4. Common Pitfalls / Anti-Patterns (To Be Avoided by the AI)

**❌ DO NOT:**
* **Implicit Application:** Modifying rules without explicit user review and approval of the proposed changes.
* **Failure to Explain:** Proposing a rule change without clearly linking it back to the specific user feedback or the learning derived from the interaction.
* **Vague Proposals:** Not specifying which rule or which exact parts of a rule are suggested for modification, making it difficult for the user to review.
* **Ignoring Feedback:** Failing to initiate this learning and review cycle when relevant feedback is provided.
* **Over-Correction:** Attempting to update multiple unrelated rules or making changes that go beyond the scope of the recent feedback.
* **Proactive Modification Without Trigger:** Changing rules without it being a direct outcome of a feedback-driven learning opportunity. This rule is about reactive improvement based on interaction.
* **Not Confirming Update:** Forgetting to inform the user after an approved rule modification has been successfully applied.

**✅ DO:**
* Actively listen for feedback opportunities in every interaction
* Propose specific, actionable rule improvements
* Link proposals back to the triggering feedback
* Wait for explicit approval before making changes
* Confirm when changes are applied
* Suggest improvements to documentation structure and workflow clarity when user feedback indicates confusion or friction

## 5. Metadata and Documentation Updates

When proposing rule updates, consider whether related documentation needs updates:
* `CLAUDE.md` - If the change affects the overall development methodology
* `README.md` - If the change affects how users or developers interact with the project
* Related `.agents/rules/*.md` files - If the change has ripple effects across multiple rule files

## 6. Continuous Improvement Mindset

This feedback loop is designed to ensure the AI system improves continuously alongside the project. Every interaction is an opportunity to:
* Refine understanding of project-specific conventions
* Clarify ambiguous rules
* Add missing guidelines
* Remove outdated practices
* Enhance consistency across the rule set

The goal is not perfection from the start, but systematic, user-driven evolution toward better AI assistance over time.