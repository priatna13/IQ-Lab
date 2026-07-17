# Responses are mutable within an open Domain Session; frozen at close

Self-dev MVP prioritizes fixing mis-taps and second thoughts inside a timed Domain over exam-strict one-way items. While a Domain Session is open (before server close via timer+grace or explicit finish-domain), the Participant may navigate items in that Domain and update Responses; the server scores the last Response per Item at close. After close, Responses are immutable and the Domain is not reopened in MVP.

**Consequences:** Response storage is upsert-by-item; scoring runs at Domain Session close (and rolls into Attempt completion); integrity logs remain separate from answer mutation.
