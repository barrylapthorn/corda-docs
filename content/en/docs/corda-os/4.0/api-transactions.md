---
aliases:
- /releases/release-V4.0/api-transactions.html
date: '2020-01-08T09:59:25Z'
menu: []
tags:
- api
- transactions
title: 'API: Transactions'
---




# API: Transactions

{{< note >}}
Before reading this page, you should be familiar with the key concepts of [Transactions](key-concepts-transactions.md).

{{< /note >}}


## Transaction lifecycle

Between its creation and its final inclusion on the ledger, a transaction will generally occupy one of three states:


* `TransactionBuilder`. A transaction’s initial state. This is the only state during which the transaction is
mutable, so we must add all the required components before moving on.
* `SignedTransaction`. The transaction now has one or more digital signatures, making it immutable. This is the
transaction type that is passed around to collect additional signatures and that is recorded on the ledger.
* `LedgerTransaction`. The transaction has been “resolved” - for example, its inputs have been converted from
references to actual states - allowing the transaction to be fully inspected.

We can visualise the transitions between the three stages as follows:

![transaction flow](/en/images/transaction-flow.png "transaction flow")

## Transaction components

A transaction consists of six types of components:


* 1+ states:
    * 0+ input states
    * 0+ output states
    * 0+ reference input states


* 1+ commands
* 0+ attachments
* 0 or 1 time-window
    * A transaction with a time-window must also have a notary



Each component corresponds to a specific class in the Corda API. The following section describes each component class,
and how it is created.


### Input states

An input state is added to a transaction as a `StateAndRef`, which combines:


* The `ContractState` itself
* A `StateRef` identifying this `ContractState` as the output of a specific transaction

{{< tabs name="tabs-1" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourStateAndRef: StateAndRef<DummyState> = serviceHub.toStateAndRef<DummyState>(ourStateRef)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L252-L252' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 21' end='DOCEND 21' */}}
{{% tab name="java" %}}
```java
StateAndRef ourStateAndRef = getServiceHub().toStateAndRef(ourStateRef);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L251-L251' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 21' end='DOCEND 21' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

A `StateRef` uniquely identifies an input state, allowing the notary to mark it as historic. It is made up of:


* The hash of the transaction that generated the state
* The state’s index in the outputs of that transaction

{{< tabs name="tabs-2" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourStateRef: StateRef = StateRef(SecureHash.sha256("DummyTransactionHash"), 0)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L248-L248' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 20' end='DOCEND 20' */}}
{{% tab name="java" %}}
```java
StateRef ourStateRef = new StateRef(SecureHash.sha256("DummyTransactionHash"), 0);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L247-L247' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 20' end='DOCEND 20' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

The `StateRef` links an input state back to the transaction that created it. This means that transactions form
“chains” linking each input back to an original issuance transaction. This allows nodes verifying the transaction
to “walk the chain” and verify that each input was generated through a valid sequence of transactions.


#### Reference input states


{{< warning >}}
Reference states are only available on Corda networks with a minimum platform version >= 4.

{{< /warning >}}


A reference input state is added to a transaction as a `ReferencedStateAndRef`. A `ReferencedStateAndRef` can be
obtained from a `StateAndRef` by calling the `StateAndRef.referenced()` method which returns a `ReferencedStateAndRef`.

{{< tabs name="tabs-3" >}}
{{% tab name="kotlin" %}}
```kotlin
val referenceState: ReferencedStateAndRef<DummyState> = ourStateAndRef.referenced()

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L262-L262' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 55' end='DOCEND 55' */}}
{{% tab name="java" %}}
```java
ReferencedStateAndRef referenceState = ourStateAndRef.referenced();

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L261-L261' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 55' end='DOCEND 55' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

**Handling of update races:**

When using reference states in a transaction, it may be the case that a notarisation failure occurs. This is most likely
because the creator of the state (being used as a reference state in your transaction), has just updated it.

Typically, the creator of such reference data will have implemented flows for syndicating the updates out to users.
However it is inevitable that there will be a delay between the state being used as a reference being consumed, and the
nodes using it receiving the update.

This is where the `WithReferencedStatesFlow` comes in. Given a flow which uses reference states, the
`WithReferencedStatesFlow` will execute the the flow as a subFlow. If the flow fails due to a `NotaryError.Conflict`
for a reference state, then it will be suspended until the state refs for the reference states are consumed. In this
case, a consumption means that:


* the owner of the reference state has updated the state with a valid, notarised transaction
* the owner of the reference state has shared the update with the node attempting to run the flow which uses the
reference state
* The node has successfully committed the transaction updating the reference state (and all the dependencies), and
added the updated reference state to the vault.

At the point where the transaction updating the state being used as a reference is committed to storage and the vault
update occurs, then the `WithReferencedStatesFlow` will wake up and re-execute the provided flow.


{{< warning >}}
Caution should be taken when using this flow as it facilitates automated re-running of flows which use
reference states. The flow using reference states should include checks to ensure that the reference data is
reasonable, especially if the economics of the transaction depends upon the data contained within a reference state.

{{< /warning >}}



### Output states

Since a transaction’s output states do not exist until the transaction is committed, they cannot be referenced as the
outputs of previous transactions. Instead, we create the desired output states as `ContractState` instances, and
add them to the transaction directly:

{{< tabs name="tabs-4" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourOutputState: DummyState = DummyState()

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L266-L266' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 22' end='DOCEND 22' */}}
{{% tab name="java" %}}
```java
DummyState ourOutputState = new DummyState();

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L265-L265' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 22' end='DOCEND 22' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

In cases where an output state represents an update of an input state, we may want to create the output state by basing
it on the input state:

{{< tabs name="tabs-5" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourOtherOutputState: DummyState = ourOutputState.copy(magicNumber = 77)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L270-L270' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 23' end='DOCEND 23' */}}
{{% tab name="java" %}}
```java
DummyState ourOtherOutputState = ourOutputState.copy(77);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L269-L269' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 23' end='DOCEND 23' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Before our output state can be added to a transaction, we need to associate it with a contract. We can do this by
wrapping the output state in a `StateAndContract`, which combines:


* The `ContractState` representing the output states
* A `String` identifying the contract governing the state

{{< tabs name="tabs-6" >}}
{{% tab name="kotlin" %}}
```kotlin
val  ourOutput: StateAndContract = StateAndContract(ourOutputState, DummyContract.PROGRAM_ID)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L275-L275' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 47' end='DOCEND 47' */}}
{{% tab name="java" %}}
```java
StateAndContract ourOutput = new StateAndContract(ourOutputState, DummyContract.PROGRAM_ID);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L274-L274' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 47' end='DOCEND 47' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Commands

A command is added to the transaction as a `Command`, which combines:


* A `CommandData` instance indicating the command’s type
* A `List<PublicKey>` representing the command’s required signers

{{< tabs name="tabs-7" >}}
{{% tab name="kotlin" %}}
```kotlin
val commandData: DummyContract.Commands.Create = DummyContract.Commands.Create()
val ourPubKey: PublicKey = serviceHub.myInfo.legalIdentitiesAndCerts.first().owningKey
val counterpartyPubKey: PublicKey = counterparty.owningKey
val requiredSigners: List<PublicKey> = listOf(ourPubKey, counterpartyPubKey)
val ourCommand: Command<DummyContract.Commands.Create> = Command(commandData, requiredSigners)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L282-L286' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 24' end='DOCEND 24' */}}
{{% tab name="java" %}}
```java
DummyContract.Commands.Create commandData = new DummyContract.Commands.Create();
PublicKey ourPubKey = getServiceHub().getMyInfo().getLegalIdentitiesAndCerts().get(0).getOwningKey();
PublicKey counterpartyPubKey = counterparty.getOwningKey();
List<PublicKey> requiredSigners = ImmutableList.of(ourPubKey, counterpartyPubKey);
Command<DummyContract.Commands.Create> ourCommand = new Command<>(commandData, requiredSigners);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L281-L285' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 24' end='DOCEND 24' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Attachments

Attachments are identified by their hash:

{{< tabs name="tabs-8" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourAttachment: SecureHash = SecureHash.sha256("DummyAttachment")

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L302-L302' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 25' end='DOCEND 25' */}}
{{% tab name="java" %}}
```java
SecureHash ourAttachment = SecureHash.sha256("DummyAttachment");

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L301-L301' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 25' end='DOCEND 25' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

The attachment with the corresponding hash must have been uploaded ahead of time via the node’s RPC interface.


### Time-windows

Time windows represent the period during which the transaction must be notarised. They can have a start and an end
time, or be open at either end:

{{< tabs name="tabs-9" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourTimeWindow: TimeWindow = TimeWindow.between(Instant.MIN, Instant.MAX)
val ourAfter: TimeWindow = TimeWindow.fromOnly(Instant.MIN)
val ourBefore: TimeWindow = TimeWindow.untilOnly(Instant.MAX)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L307-L309' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 26' end='DOCEND 26' */}}
{{% tab name="java" %}}
```java
TimeWindow ourTimeWindow = TimeWindow.between(Instant.MIN, Instant.MAX);
TimeWindow ourAfter = TimeWindow.fromOnly(Instant.MIN);
TimeWindow ourBefore = TimeWindow.untilOnly(Instant.MAX);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L308-L310' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 26' end='DOCEND 26' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

We can also define a time window as an `Instant` plus/minus a time tolerance (e.g. 30 seconds):

{{< tabs name="tabs-10" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourTimeWindow2: TimeWindow = TimeWindow.withTolerance(serviceHub.clock.instant(), 30.seconds)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L315-L315' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 42' end='DOCEND 42' */}}
{{% tab name="java" %}}
```java
TimeWindow ourTimeWindow2 = TimeWindow.withTolerance(getServiceHub().getClock().instant(), Duration.ofSeconds(30));

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L316-L316' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 42' end='DOCEND 42' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or as a start-time plus a duration:

{{< tabs name="tabs-11" >}}
{{% tab name="kotlin" %}}
```kotlin
val ourTimeWindow3: TimeWindow = TimeWindow.fromStartAndDuration(serviceHub.clock.instant(), 30.seconds)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L319-L319' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 43' end='DOCEND 43' */}}
{{% tab name="java" %}}
```java
TimeWindow ourTimeWindow3 = TimeWindow.fromStartAndDuration(getServiceHub().getClock().instant(), Duration.ofSeconds(30));

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L320-L320' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 43' end='DOCEND 43' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


## TransactionBuilder


### Creating a builder

The first step when creating a transaction proposal is to instantiate a `TransactionBuilder`.

If the transaction has input states or a time-window, we need to instantiate the builder with a reference to the notary
that will notarise the inputs and verify the time-window:

{{< tabs name="tabs-12" >}}
{{% tab name="kotlin" %}}
```kotlin
val txBuilder: TransactionBuilder = TransactionBuilder(specificNotary)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L330-L330' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 19' end='DOCEND 19' */}}
{{% tab name="java" %}}
```java
TransactionBuilder txBuilder = new TransactionBuilder(specificNotary);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L331-L331' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 19' end='DOCEND 19' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

We discuss the selection of a notary in [API: Flows](api-flows.md).

If the transaction does not have any input states or a time-window, it does not require a notary, and can be
instantiated without one:

{{< tabs name="tabs-13" >}}
{{% tab name="kotlin" %}}
```kotlin
val txBuilderNoNotary: TransactionBuilder = TransactionBuilder()

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L335-L335' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 46' end='DOCEND 46' */}}
{{% tab name="java" %}}
```java
TransactionBuilder txBuilderNoNotary = new TransactionBuilder();

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L336-L336' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 46' end='DOCEND 46' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Adding items

The next step is to build up the transaction proposal by adding the desired components.

We can add components to the builder using the `TransactionBuilder.withItems` method:

{{< tabs name="tabs-14" >}}
{{% tab name="kotlin" %}}
```kotlin
    /** A more convenient way to add items to this transaction that calls the add* methods for you based on type */
    fun withItems(vararg items: Any) = apply {
        for (t in items) {
            when (t) {
                is StateAndRef<*> -> addInputState(t)
                is ReferencedStateAndRef<*> -> addReferenceState(t)
                is SecureHash -> addAttachment(t)
                is TransactionState<*> -> addOutputState(t)
                is StateAndContract -> addOutputState(t.state, t.contract)
                is ContractState -> throw UnsupportedOperationException("Removed as of V1: please use a StateAndContract instead")
                is Command<*> -> addCommand(t)
                is CommandData -> throw IllegalArgumentException("You passed an instance of CommandData, but that lacks the pubkey. You need to wrap it in a Command object first.")
                is TimeWindow -> setTimeWindow(t)
                is PrivacySalt -> setPrivacySalt(t)
                else -> throw IllegalArgumentException("Wrong argument type: ${t.javaClass}")
            }
        }
    }

```
{{% /tab %}}
{{/* github src='core/src/main/kotlin/net/corda/core/transactions/TransactionBuilder.kt' url='https://github.com/corda/corda/blob/release/4.0/core/src/main/kotlin/net/corda/core/transactions/TransactionBuilder.kt#L97-L114' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/core/src/main/kotlin/net/corda/core/transactions/TransactionBuilder.kt' start='DOCSTART 1' end='DOCEND 1' */}}

[TransactionBuilder.kt](https://github.com/corda/corda/blob/release/os/4.0/core/src/main/kotlin/net/corda/core/transactions/TransactionBuilder.kt) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

`withItems` takes a `vararg` of objects and adds them to the builder based on their type:


* `StateAndRef` objects are added as input states
* `ReferencedStateAndRef` objects are added as reference input states
* `TransactionState` and `StateAndContract` objects are added as output states
    * Both `TransactionState` and `StateAndContract` are wrappers around a `ContractState` output that link the
output to a specific contract


* `Command` objects are added as commands
* `SecureHash` objects are added as attachments
* A `TimeWindow` object replaces the transaction’s existing `TimeWindow`, if any

Passing in objects of any other type will cause an `IllegalArgumentException` to be thrown.

Here’s an example usage of `TransactionBuilder.withItems`:

{{< tabs name="tabs-15" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.withItems(
        // Inputs, as ``StateAndRef``s that reference the outputs of previous transactions
        ourStateAndRef,
        // Outputs, as ``StateAndContract``s
        ourOutput,
        // Commands, as ``Command``s
        ourCommand,
        // Attachments, as ``SecureHash``es
        ourAttachment,
        // A time-window, as ``TimeWindow``
        ourTimeWindow
)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L340-L351' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 27' end='DOCEND 27' */}}
{{% tab name="java" %}}
```java
txBuilder.withItems(
        // Inputs, as ``StateAndRef``s that reference to the outputs of previous transactions
        ourStateAndRef,
        // Outputs, as ``StateAndContract``s
        ourOutput,
        // Commands, as ``Command``s
        ourCommand,
        // Attachments, as ``SecureHash``es
        ourAttachment,
        // A time-window, as ``TimeWindow``
        ourTimeWindow
);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L341-L352' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 27' end='DOCEND 27' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

There are also individual methods for adding components.

Here are the methods for adding inputs and attachments:

{{< tabs name="tabs-16" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.addInputState(ourStateAndRef)
txBuilder.addAttachment(ourAttachment)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L358-L359' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 28' end='DOCEND 28' */}}
{{% tab name="java" %}}
```java
txBuilder.addInputState(ourStateAndRef);
txBuilder.addAttachment(ourAttachment);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L359-L360' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 28' end='DOCEND 28' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

An output state can be added as a `ContractState`, contract class name and notary:

{{< tabs name="tabs-17" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.addOutputState(ourOutputState, DummyContract.PROGRAM_ID, specificNotary)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L364-L364' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 49' end='DOCEND 49' */}}
{{% tab name="java" %}}
```java
txBuilder.addOutputState(ourOutputState, DummyContract.PROGRAM_ID, specificNotary);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L365-L365' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 49' end='DOCEND 49' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

We can also leave the notary field blank, in which case the transaction’s default notary is used:

{{< tabs name="tabs-18" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.addOutputState(ourOutputState, DummyContract.PROGRAM_ID)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L369-L369' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 50' end='DOCEND 50' */}}
{{% tab name="java" %}}
```java
txBuilder.addOutputState(ourOutputState, DummyContract.PROGRAM_ID);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L370-L370' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 50' end='DOCEND 50' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or we can add the output state as a `TransactionState`, which already specifies the output’s contract and notary:

{{< tabs name="tabs-19" >}}
{{% tab name="kotlin" %}}
```kotlin
val txState: TransactionState<DummyState> = TransactionState(ourOutputState, DummyContract.PROGRAM_ID, specificNotary)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L374-L374' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 51' end='DOCEND 51' */}}
{{% tab name="java" %}}
```java
TransactionState txState = new TransactionState(ourOutputState, DummyContract.PROGRAM_ID, specificNotary);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L375-L375' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 51' end='DOCEND 51' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Commands can be added as a `Command`:

{{< tabs name="tabs-20" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.addCommand(ourCommand)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L379-L379' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 52' end='DOCEND 52' */}}
{{% tab name="java" %}}
```java
txBuilder.addCommand(ourCommand);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L380-L380' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 52' end='DOCEND 52' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or as `CommandData` and a `vararg PublicKey`:

{{< tabs name="tabs-21" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.addCommand(commandData, ourPubKey, counterpartyPubKey)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L383-L383' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 53' end='DOCEND 53' */}}
{{% tab name="java" %}}
```java
txBuilder.addCommand(commandData, ourPubKey, counterpartyPubKey);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L384-L384' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 53' end='DOCEND 53' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

For the time-window, we can set a time-window directly:

{{< tabs name="tabs-22" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.setTimeWindow(ourTimeWindow)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L388-L388' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 44' end='DOCEND 44' */}}
{{% tab name="java" %}}
```java
txBuilder.setTimeWindow(ourTimeWindow);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L389-L389' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 44' end='DOCEND 44' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or define the time-window as a time plus a duration (e.g. 45 seconds):

{{< tabs name="tabs-23" >}}
{{% tab name="kotlin" %}}
```kotlin
txBuilder.setTimeWindow(serviceHub.clock.instant(), 45.seconds)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L392-L392' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 45' end='DOCEND 45' */}}
{{% tab name="java" %}}
```java
txBuilder.setTimeWindow(getServiceHub().getClock().instant(), Duration.ofSeconds(45));

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L393-L393' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 45' end='DOCEND 45' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Signing the builder

Once the builder is ready, we finalize it by signing it and converting it into a `SignedTransaction`.

We can either sign with our legal identity key:

{{< tabs name="tabs-24" >}}
{{% tab name="kotlin" %}}
```kotlin
val onceSignedTx: SignedTransaction = serviceHub.signInitialTransaction(txBuilder)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L403-L403' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 29' end='DOCEND 29' */}}
{{% tab name="java" %}}
```java
SignedTransaction onceSignedTx = getServiceHub().signInitialTransaction(txBuilder);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L404-L404' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 29' end='DOCEND 29' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or we can also choose to use another one of our public keys:

{{< tabs name="tabs-25" >}}
{{% tab name="kotlin" %}}
```kotlin
val otherIdentity: PartyAndCertificate = serviceHub.keyManagementService.freshKeyAndCert(ourIdentityAndCert, false)
val onceSignedTx2: SignedTransaction = serviceHub.signInitialTransaction(txBuilder, otherIdentity.owningKey)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L407-L408' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 30' end='DOCEND 30' */}}
{{% tab name="java" %}}
```java
PartyAndCertificate otherIdentity = getServiceHub().getKeyManagementService().freshKeyAndCert(getOurIdentityAndCert(), false);
SignedTransaction onceSignedTx2 = getServiceHub().signInitialTransaction(txBuilder, otherIdentity.getOwningKey());

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L408-L409' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 30' end='DOCEND 30' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Either way, the outcome of this process is to create an immutable `SignedTransaction` with our signature over it.


## SignedTransaction

A `SignedTransaction` is a combination of:


* An immutable transaction
* A list of signatures over that transaction

{{< tabs name="tabs-26" >}}
{{% tab name="kotlin" %}}
```kotlin
@KeepForDJVM
@CordaSerializable
data class SignedTransaction(val txBits: SerializedBytes<CoreTransaction>,
                             override val sigs: List<TransactionSignature>
) : TransactionWithSignatures {

```
{{% /tab %}}
{{/* github src='core/src/main/kotlin/net/corda/core/transactions/SignedTransaction.kt' url='https://github.com/corda/corda/blob/release/4.0/core/src/main/kotlin/net/corda/core/transactions/SignedTransaction.kt#L41-L45' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/core/src/main/kotlin/net/corda/core/transactions/SignedTransaction.kt' start='DOCSTART 1' end='DOCEND 1' */}}

[SignedTransaction.kt](https://github.com/corda/corda/blob/release/os/4.0/core/src/main/kotlin/net/corda/core/transactions/SignedTransaction.kt) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Before adding our signature to the transaction, we’ll want to verify both the transaction’s contents and the
transaction’s signatures.


### Verifying the transaction’s contents

If a transaction has inputs, we need to retrieve all the states in the transaction’s dependency chain before we can
verify the transaction’s contents. This is because the transaction is only valid if its dependency chain is also valid.
We do this by requesting any states in the chain that our node doesn’t currently have in its local storage from the
proposer(s) of the transaction. This process is handled by a built-in flow called `ReceiveTransactionFlow`.
See [API: Flows](api-flows.md) for more details.

We can now verify the transaction’s contents to ensure that it satisfies the contracts of all the transaction’s input
and output states:

{{< tabs name="tabs-27" >}}
{{% tab name="kotlin" %}}
```kotlin
twiceSignedTx.verify(serviceHub)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L483-L483' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 33' end='DOCEND 33' */}}
{{% tab name="java" %}}
```java
twiceSignedTx.verify(getServiceHub());

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L482-L482' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 33' end='DOCEND 33' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Checking that the transaction meets the contract constraints is only part of verifying the transaction’s contents. We
will usually also want to perform our own additional validation of the transaction contents before signing, to ensure
that the transaction proposal represents an agreement we wish to enter into.

However, the `SignedTransaction` holds its inputs as `StateRef` instances, and its attachments as `SecureHash`
instances, which do not provide enough information to properly validate the transaction’s contents. We first need to
resolve the `StateRef` and `SecureHash` instances into actual `ContractState` and `Attachment` instances, which
we can then inspect.

We achieve this by using the `ServiceHub` to convert the `SignedTransaction` into a `LedgerTransaction`:

{{< tabs name="tabs-28" >}}
{{% tab name="kotlin" %}}
```kotlin
val ledgerTx: LedgerTransaction = twiceSignedTx.toLedgerTransaction(serviceHub)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L497-L497' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 32' end='DOCEND 32' */}}
{{% tab name="java" %}}
```java
LedgerTransaction ledgerTx = twiceSignedTx.toLedgerTransaction(getServiceHub());

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L496-L496' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 32' end='DOCEND 32' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

We can now perform our additional verification. Here’s a simple example:

{{< tabs name="tabs-29" >}}
{{% tab name="kotlin" %}}
```kotlin
val outputState: DummyState = ledgerTx.outputsOfType<DummyState>().single()
if (outputState.magicNumber == 777) {
    // ``FlowException`` is a special exception type. It will be
    // propagated back to any counterparty flows waiting for a
    // message from this flow, notifying them that the flow has
    // failed.
    throw FlowException("We expected a magic number of 777.")
}

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L502-L509' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 34' end='DOCEND 34' */}}
{{% tab name="java" %}}
```java
DummyState outputState = ledgerTx.outputsOfType(DummyState.class).get(0);
if (outputState.getMagicNumber() != 777) {
    // ``FlowException`` is a special exception type. It will be
    // propagated back to any counterparty flows waiting for a
    // message from this flow, notifying them that the flow has
    // failed.
    throw new FlowException("We expected a magic number of 777.");
}

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L501-L508' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 34' end='DOCEND 34' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Verifying the transaction’s signatures

Aside from verifying that the transaction’s contents are valid, we also need to check that the signatures are valid. A
valid signature over the hash of the transaction prevents tampering.

We can verify that all the transaction’s required signatures are present and valid as follows:

{{< tabs name="tabs-30" >}}
{{% tab name="kotlin" %}}
```kotlin
fullySignedTx.verifyRequiredSignatures()

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L539-L539' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 35' end='DOCEND 35' */}}
{{% tab name="java" %}}
```java
fullySignedTx.verifyRequiredSignatures();

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L544-L544' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 35' end='DOCEND 35' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

However, we’ll often want to verify the transaction’s existing signatures before all of them have been collected. For
this we can use `SignedTransaction.verifySignaturesExcept`, which takes a `vararg` of the public keys for
which the signatures are allowed to be missing:

{{< tabs name="tabs-31" >}}
{{% tab name="kotlin" %}}
```kotlin
onceSignedTx.verifySignaturesExcept(counterpartyPubKey)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L546-L546' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 36' end='DOCEND 36' */}}
{{% tab name="java" %}}
```java
onceSignedTx.verifySignaturesExcept(counterpartyPubKey);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L551-L551' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 36' end='DOCEND 36' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

There is also an overload of `SignedTransaction.verifySignaturesExcept`, which takes a `Collection` of the
public keys for which the signatures are allowed to be missing:

{{< tabs name="tabs-32" >}}
{{% tab name="kotlin" %}}
```kotlin
onceSignedTx.verifySignaturesExcept(listOf(counterpartyPubKey))

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L553-L553' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 54' end='DOCEND 54' */}}
{{% tab name="java" %}}
```java
onceSignedTx.verifySignaturesExcept(singletonList(counterpartyPubKey));

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L560-L560' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 54' end='DOCEND 54' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

If the transaction is missing any signatures without the corresponding public keys being passed in, a
`SignaturesMissingException` is thrown.

We can also choose to simply verify the signatures that are present:

{{< tabs name="tabs-33" >}}
{{% tab name="kotlin" %}}
```kotlin
twiceSignedTx.checkSignaturesAreValid()

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L560-L560' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 37' end='DOCEND 37' */}}
{{% tab name="java" %}}
```java
twiceSignedTx.checkSignaturesAreValid();

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L567-L567' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 37' end='DOCEND 37' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Be very careful, however - this function neither guarantees that the signatures that are present are required, nor
checks whether any signatures are missing.


### Signing the transaction

Once we are satisfied with the contents and existing signatures over the transaction, we add our signature to the
`SignedTransaction` to indicate that we approve the transaction.

We can sign using our legal identity key, as follows:

{{< tabs name="tabs-34" >}}
{{% tab name="kotlin" %}}
```kotlin
val twiceSignedTx: SignedTransaction = serviceHub.addSignature(onceSignedTx)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L415-L415' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 38' end='DOCEND 38' */}}
{{% tab name="java" %}}
```java
SignedTransaction twiceSignedTx = getServiceHub().addSignature(onceSignedTx);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L416-L416' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 38' end='DOCEND 38' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or we can choose to sign using another one of our public keys:

{{< tabs name="tabs-35" >}}
{{% tab name="kotlin" %}}
```kotlin
val twiceSignedTx2: SignedTransaction = serviceHub.addSignature(onceSignedTx, otherIdentity2.owningKey)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L420-L420' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 39' end='DOCEND 39' */}}
{{% tab name="java" %}}
```java
SignedTransaction twiceSignedTx2 = getServiceHub().addSignature(onceSignedTx, otherIdentity2.getOwningKey());

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L421-L421' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 39' end='DOCEND 39' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

We can also generate a signature over the transaction without adding it to the transaction directly.

We can do this with our legal identity key:

{{< tabs name="tabs-36" >}}
{{% tab name="kotlin" %}}
```kotlin
val sig: TransactionSignature = serviceHub.createSignature(onceSignedTx)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L430-L430' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 40' end='DOCEND 40' */}}
{{% tab name="java" %}}
```java
TransactionSignature sig = getServiceHub().createSignature(onceSignedTx);

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L431-L431' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 40' end='DOCEND 40' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}

Or using another one of our public keys:

{{< tabs name="tabs-37" >}}
{{% tab name="kotlin" %}}
```kotlin
val sig2: TransactionSignature = serviceHub.createSignature(onceSignedTx, otherIdentity2.owningKey)

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt#L434-L434' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt' start='DOCSTART 41' end='DOCEND 41' */}}
{{% tab name="java" %}}
```java
TransactionSignature sig2 = getServiceHub().createSignature(onceSignedTx, otherIdentity2.getOwningKey());

```
{{% /tab %}}
{{/* github src='docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' url='https://github.com/corda/corda/blob/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java#L435-L435' raw='https://raw.githubusercontent.com/corda/corda/release/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java' start='DOCSTART 41' end='DOCEND 41' */}}

[FlowCookbook.kt](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/kotlin/net/corda/docs/kotlin/FlowCookbook.kt) | [FlowCookbook.java](https://github.com/corda/corda/blob/release/os/4.0/docs/source/example-code/src/main/java/net/corda/docs/java/FlowCookbook.java) | ![github](/images/svg/github.svg "github")

{{< /tabs >}}


### Notarising and recording

Notarising and recording a transaction is handled by a built-in flow called `FinalityFlow`. See [API: Flows](api-flows.md) for
more details.
