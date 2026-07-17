# Early Finish is allowed only when every Item has a Response

Participants should not idle out a full domain timer after finishing thoughtfully, but they also should not one-tap close with half the items blank. A Domain Session closes early only if the server holds a Response for every Item in that domain. Partial domains happen solely via server timer (+ Grace Window), with missing Responses scored empty. Unused time does not carry to other Domains.

**Consequences:** UI disables “Selesai domain” until completion ratio is 100%; close paths are early-complete vs timer-partial only.
