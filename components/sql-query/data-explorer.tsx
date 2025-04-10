import { Button, Divider } from "@heroui/react";
import { Database } from "lucide-react";

const datasets = getDatasets();

type TDataset = (typeof datasets)[keyof typeof datasets];
type DatasetProps = {
  dataset: TDataset;
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Dataset = ({ name, dataset }: DatasetProps) => (
  <section>
    <header>
      <h3>{name}</h3>
    </header>
  </section>
);

const DataExplorer = () => {
  const names = Object.keys(datasets);

  return (
    <section className="h-full rounded-xl bg-primary-100 bg-opacity-[0.04]">
      <header>
        <h2 className="p-4 font-serif font-semibold">Data Explorer</h2>
      </header>
      <Divider />
      <div className="p-4">
        <ul className="flex flex-col gap-2">
          {names.map((name) => (
            <li key={name} className="group flex items-center">
              <Database
                size={32}
                className="inline-block rounded-md bg-default-50 p-2 group-hover:text-primary"
              />
              <Button className="inline-flex justify-start" fullWidth>
                {name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DataExplorer;

function getDatasets() {
  return {
    "Ethereum Mainnet": [
      {
        id: "accounts",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.accounts",
        schema: {
          fields: [
            { name: "address", type: "STRING", mode: "NULLABLE" },
            { name: "code_hash", type: "STRING", mode: "NULLABLE" },
            { name: "code", type: "STRING", mode: "NULLABLE" },
            { name: "is_contract", type: "BOOLEAN", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["address"] },
      },
      {
        id: "accounts_state",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.accounts_state",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block this account state was indexed from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block this account state was indexed from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address identifying the account.",
            },
            {
              name: "nonce",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Nonce (transaction count) associated with this account at this block.",
            },
            {
              name: "balance",
              type: "BIGNUMERIC",
              mode: "REQUIRED",
              description:
                "Native Ether balance of the account in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
            },
            {
              name: "balance_lossless",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Native Ether balance of the account in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
            },
            {
              name: "code_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Hash of the code of the account. For all externally-owned accounts this will be "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470". This is the hash when there is no code present.',
            },
            {
              name: "code",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Compiled bytecode of this account in hexadecimal format, given the account is a smart contract.",
            },
            {
              name: "account_proof",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Merkle proof for verifying the account balance at the given block. An array of RLP-serialized Merkle tree nodes, starting with the state root node.",
            },
            {
              name: "storage_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Hash of the storage root representing a Merkle proof. For all non-smart contract accounts this will be "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421". This is the hash of an empty Merkle tree.',
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "accounts_state_by_address",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.accounts_state_by_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "address", type: "STRING", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "balance", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "balance_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "code_hash", type: "STRING", mode: "NULLABLE" },
            { name: "code", type: "STRING", mode: "NULLABLE" },
            { name: "account_proof", type: "STRING", mode: "REPEATED" },
            { name: "storage_hash", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["address"] },
      },
      {
        id: "blocks",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.blocks",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "parent_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the parent block.",
            },
            {
              name: "size",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Size of this block in bytes.",
            },
            {
              name: "extra_data",
              type: "STRING",
              mode: "REQUIRED",
              description: "Extra data of this block.",
            },
            {
              name: "gas_limit",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Maximum gas allowed in this block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Total gas used by all transactions in this block.",
            },
            {
              name: "base_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Reserve price that transactions must pay for inclusion in this block.",
            },
            {
              name: "mix_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "32-byte hash which proves, when combined with the nonce, that a sufficient amount of computation has been carried out on this block.",
            },
            {
              name: "nonce",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "8-byte integer in hexadecimal format. Used together with the mix hash to show the proof of work.",
            },
            {
              name: "difficulty",
              type: "BIGNUMERIC",
              mode: "NULLABLE",
              description: "Difficulty for this block.",
            },
            {
              name: "total_difficulty",
              type: "BIGNUMERIC",
              mode: "NULLABLE",
              description:
                "Accumulated difficulty of the chain until this block.",
            },
            {
              name: "miner",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Address of the beneficiary to whom the mining rewards were given.",
            },
            {
              name: "sha3_uncles",
              type: "STRING",
              mode: "REQUIRED",
              description: "SHA3 of the uncles data in the block.",
            },
            {
              name: "transaction_count",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of transactions in the block.",
            },
            {
              name: "transactions_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the transaction trie of the block.",
            },
            {
              name: "receipts_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the receipts trie of the block.",
            },
            {
              name: "state_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the final state trie of the block.",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              mode: "REQUIRED",
              description: "Bloom filter for the logs of the block.",
            },
            {
              name: "withdrawals_root",
              type: "STRING",
              mode: "NULLABLE",
              description: "Validator withdrawal root.",
            },
            {
              name: "withdrawals",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                {
                  name: "index",
                  type: "INTEGER",
                  mode: "REQUIRED",
                  description: "Index of the withdrawal.",
                },
                {
                  name: "validator_index",
                  type: "INTEGER",
                  mode: "REQUIRED",
                  description:
                    "Index of the validator that generated withdrawal.",
                },
                {
                  name: "address",
                  type: "STRING",
                  mode: "REQUIRED",
                  description: "Recipient address for withdrawal value.",
                },
                {
                  name: "amount",
                  type: "BIGNUMERIC",
                  mode: "REQUIRED",
                  description:
                    "Value transferred by the withdrawal in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
                },
                {
                  name: "amount_lossless",
                  type: "STRING",
                  mode: "REQUIRED",
                  description:
                    "Value transferred by the withdrawal in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
                },
              ],
              description: "Validator withdrawals.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "decoded_events",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.decoded_events",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this event was emitted from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this event was emitted from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the transaction this event was emitted from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The event's index position in the block.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this event originated.",
            },
            {
              name: "event_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Keccak hash of the event signature.",
            },
            {
              name: "event_signature",
              type: "STRING",
              mode: "NULLABLE",
              description: "Function signature of the event.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description: "The original indexed topics of the event.",
            },
            {
              name: "args",
              type: "JSON",
              mode: "NULLABLE",
              description:
                "The decoded arguments of the event as a JSON array.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the event was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "logs",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.logs",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this log was created from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this log was created from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction this log was created from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The log's index position in the block.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this log originated.",
            },
            {
              name: "data",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Contains one or more 32-byte non-indexed arguments of the log.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Array of 0 to 4 32-byte hex of indexed log arguments.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the log was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "receipts",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.receipts",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the receiver.",
            },
            {
              name: "contract_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Hexadecimal-encoded address of new contract or absent if no contract was created.",
            },
            {
              name: "cumulative_gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Gas used by this and all preceding transactions in the block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Gas used by this transaction alone.",
            },
            {
              name: "effective_gas_price",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Actual value per gas deducted from the sender's account.",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              mode: "REQUIRED",
              description: "Bloom filter of the logs from this transaction.",
            },
            {
              name: "root",
              type: "STRING",
              mode: "NULLABLE",
              description: "Post-transaction state root.",
            },
            {
              name: "status",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Either 1 (success) or 0 (failure).",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "token_transfers",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.token_transfers",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this event was emitted from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this event was emitted from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the transaction this event was emitted from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "event_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The event's index position in the block.",
            },
            {
              name: "batch_index",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "The transfer's position in the batch transfer event.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this event originated.",
            },
            {
              name: "event_type",
              type: "STRING",
              mode: "REQUIRED",
              description: "Token standard that matches the event.",
            },
            {
              name: "event_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Keccak hash of the event signature.",
            },
            {
              name: "event_signature",
              type: "STRING",
              mode: "REQUIRED",
              description: "Function signature of the event.",
            },
            {
              name: "operator_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the transfer operator.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the previous owner of the token(s).",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the new owner of the token(s).",
            },
            {
              name: "token_id",
              type: "STRING",
              mode: "NULLABLE",
              description: "Identifier of the token(s) being transferred.",
            },
            {
              name: "quantity",
              type: "STRING",
              mode: "REQUIRED",
              description: "Quantity of tokens being transferred.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the event was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "traces",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.traces",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this trace was created from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this trace was created from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "The transaction's index position in the block.",
            },
            {
              name: "trace_type",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Trace type. One of "create", "suicide", "call" or "reward".',
            },
            {
              name: "trace_address",
              type: "INTEGER",
              mode: "REPEATED",
              description:
                "A sequence of indices that uniquely identifies this trace within the call tree. Available only for transaction-scoped traces.",
            },
            {
              name: "subtrace_count",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of subtraces of this trace.",
            },
            {
              name: "action",
              type: "RECORD",
              mode: "REQUIRED",
              fields: [
                {
                  name: "from_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the sender. Null for "suicide" and "reward" traces.',
                },
                {
                  name: "to_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the receiver. Null for "suicide" and "reward" traces.',
                },
                {
                  name: "call_type",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Trace call type. One of "call", "callcode", "staticcall" or "delegatecall". Available only for "call" traces.',
                },
                {
                  name: "gas",
                  type: "INTEGER",
                  mode: "NULLABLE",
                  description: "Amount of gas provided by the sender.",
                },
                {
                  name: "input",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Input sent along with the transaction. Available only for "call" traces.',
                },
                {
                  name: "value",
                  type: "BIGNUMERIC",
                  mode: "NULLABLE",
                  description:
                    'Value transferred by this trace in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision. Available only for "call" traces.',
                },
                {
                  name: "value_lossless",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Value transferred by this trace in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision. Available only for "call" traces.',
                },
                {
                  name: "init",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Input sent along with the transaction that deploys the contract. Available only for "create" traces.',
                },
                {
                  name: "author",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Recipient of the block or uncle reward. Available only for "reward" traces.',
                },
                {
                  name: "reward_type",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Reward type. One of "block" or "uncle". Available only for "reward" traces.',
                },
                {
                  name: "refund_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address to which the remaining balance of a suicided contract was transferred. Value is set only for "suicide" traces.',
                },
                {
                  name: "refund_balance",
                  type: "BIGNUMERIC",
                  mode: "NULLABLE",
                  description:
                    'Refund balance in Wei for a suicided contract. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision. Available only for "suicide" traces.',
                },
                {
                  name: "refund_balance_lossless",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Refund balance in Wei for a suicided contract. A decimal number represented in STRING format to preserve full 256-bit numeric precision. Available only for "suicide" traces.',
                },
                {
                  name: "self_destructed_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the contract being self-destructed. Available only for "suicide" traces.',
                },
              ],
              description: "Action being carried out by this trace.",
            },
            {
              name: "result",
              type: "RECORD",
              mode: "NULLABLE",
              fields: [
                {
                  name: "gas_used",
                  type: "INTEGER",
                  mode: "NULLABLE",
                  description: "Gas used by this trace alone.",
                },
                {
                  name: "output",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    "Value returned by the contract call. Empty if the RETURN method was not executed.",
                },
                {
                  name: "address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the deployed smart contract. Available only for "create" traces.',
                },
                {
                  name: "code",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Code of the deployed smart contract. Available only for "create" traces.',
                },
              ],
              description: "Result of this trace.",
            },
            {
              name: "error",
              type: "STRING",
              mode: "NULLABLE",
              description: "Error message of this trace, if any.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "transactions",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "nonce",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of transactions made by the sender prior to this one.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the receiver.",
            },
            {
              name: "value",
              type: "BIGNUMERIC",
              mode: "REQUIRED",
              description:
                "Value transferred in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
            },
            {
              name: "value_lossless",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Value transferred in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
            },
            {
              name: "gas",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Quantity of gas units provided by the sender.",
            },
            {
              name: "gas_price",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Price per gas unit provided by the sender in Wei.",
            },
            {
              name: "input",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Data sent along with the transaction, with a maximum size of 32 bytes.",
            },
            {
              name: "max_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Maximum fee per unit of gas for this transaction.",
            },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Maximum priority fee per unit of gas for this transaction.",
            },
            {
              name: "transaction_type",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Type of the transaction.",
            },
            {
              name: "chain_id",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Chain ID used in transaction signing.",
            },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                {
                  name: "address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description: "Smart contract or wallet address.",
                },
                {
                  name: "storage_keys",
                  type: "STRING",
                  mode: "REPEATED",
                  description:
                    "Storage keys for accessing the Merkle tree state.",
                },
              ],
              description:
                "List of addresses and storage keys that the transaction plans to access and has pre-paid gas for.",
            },
            {
              name: "r",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature r.",
            },
            {
              name: "s",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature s.",
            },
            {
              name: "v",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature v.",
            },
            {
              name: "y_parity",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature y_parity.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "transactions_by_from_address",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions_by_from_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "transaction_hash", type: "STRING", mode: "NULLABLE" },
            { name: "transaction_index", type: "INTEGER", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "from_address", type: "STRING", mode: "NULLABLE" },
            { name: "to_address", type: "STRING", mode: "NULLABLE" },
            { name: "value", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "value_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "gas", type: "INTEGER", mode: "NULLABLE" },
            { name: "gas_price", type: "INTEGER", mode: "NULLABLE" },
            { name: "input", type: "STRING", mode: "NULLABLE" },
            { name: "max_fee_per_gas", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
            },
            { name: "transaction_type", type: "INTEGER", mode: "NULLABLE" },
            { name: "chain_id", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                { name: "address", type: "STRING", mode: "NULLABLE" },
                { name: "storage_keys", type: "STRING", mode: "REPEATED" },
              ],
            },
            { name: "r", type: "STRING", mode: "NULLABLE" },
            { name: "s", type: "STRING", mode: "NULLABLE" },
            { name: "v", type: "STRING", mode: "NULLABLE" },
            { name: "y_parity", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["from_address"] },
      },
      {
        id: "transactions_by_to_address",
        did: "bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions_by_to_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "transaction_hash", type: "STRING", mode: "NULLABLE" },
            { name: "transaction_index", type: "INTEGER", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "from_address", type: "STRING", mode: "NULLABLE" },
            { name: "to_address", type: "STRING", mode: "NULLABLE" },
            { name: "value", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "value_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "gas", type: "INTEGER", mode: "NULLABLE" },
            { name: "gas_price", type: "INTEGER", mode: "NULLABLE" },
            { name: "input", type: "STRING", mode: "NULLABLE" },
            { name: "max_fee_per_gas", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
            },
            { name: "transaction_type", type: "INTEGER", mode: "NULLABLE" },
            { name: "chain_id", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                { name: "address", type: "STRING", mode: "NULLABLE" },
                { name: "storage_keys", type: "STRING", mode: "REPEATED" },
              ],
            },
            { name: "r", type: "STRING", mode: "NULLABLE" },
            { name: "s", type: "STRING", mode: "NULLABLE" },
            { name: "v", type: "STRING", mode: "NULLABLE" },
            { name: "y_parity", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["to_address"] },
      },
    ],
    "Crypto Ethereum": [
      {
        id: "amended_tokens",
        did: "bigquery-public-data.crypto_ethereum.amended_tokens",
        schema: {
          fields: [
            { name: "address", type: "STRING", mode: "NULLABLE" },
            { name: "symbol", type: "STRING", mode: "NULLABLE" },
            { name: "name", type: "STRING", mode: "NULLABLE" },
            { name: "decimals", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "VIEW",
      },
      {
        id: "balances",
        did: "bigquery-public-data.crypto_ethereum.balances",
        schema: {
          fields: [
            {
              name: "address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address",
            },
            {
              name: "eth_balance",
              type: "NUMERIC",
              mode: "NULLABLE",
              description: "Ether balance",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "blocks",
        did: "bigquery-public-data.crypto_ethereum.blocks",
        schema: {
          fields: [
            {
              name: "timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description: "The timestamp for when the block was collated",
            },
            {
              name: "number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The block number",
            },
            {
              name: "hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block",
            },
            {
              name: "parent_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Hash of the parent block",
            },
            {
              name: "nonce",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the generated proof-of-work",
            },
            {
              name: "sha3_uncles",
              type: "STRING",
              mode: "NULLABLE",
              description: "SHA3 of the uncles data in the block",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              mode: "NULLABLE",
              description: "The bloom filter for the logs of the block",
            },
            {
              name: "transactions_root",
              type: "STRING",
              mode: "NULLABLE",
              description: "The root of the transaction trie of the block",
            },
            {
              name: "state_root",
              type: "STRING",
              mode: "NULLABLE",
              description: "The root of the final state trie of the block",
            },
            {
              name: "receipts_root",
              type: "STRING",
              mode: "NULLABLE",
              description: "The root of the receipts trie of the block",
            },
            {
              name: "miner",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "The address of the beneficiary to whom the mining rewards were given",
            },
            {
              name: "difficulty",
              type: "NUMERIC",
              mode: "NULLABLE",
              description: "Integer of the difficulty for this block",
            },
            {
              name: "total_difficulty",
              type: "NUMERIC",
              mode: "NULLABLE",
              description:
                "Integer of the total difficulty of the chain until this block",
            },
            {
              name: "size",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "The size of this block in bytes",
            },
            {
              name: "extra_data",
              type: "STRING",
              mode: "NULLABLE",
              description: "The extra data field of this block",
            },
            {
              name: "gas_limit",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "The maximum gas allowed in this block",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "The total used gas by all transactions in this block",
            },
            {
              name: "transaction_count",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "The number of transactions in the block",
            },
            {
              name: "base_fee_per_gas",
              type: "INTEGER",
              description:
                "Protocol base fee per gas, which can move up or down",
            },
            {
              name: "withdrawals_root",
              type: "STRING",
              description: "The root of the withdrawal trie of the block",
            },
            {
              name: "withdrawals",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                { name: "index", type: "INTEGER" },
                { name: "validator_index", type: "INTEGER" },
                { name: "address", type: "STRING" },
                { name: "amount", type: "STRING" },
              ],
              description: "Validator withdrawals",
            },
            {
              name: "blob_gas_used",
              type: "INTEGER",
              description:
                "The total amount of blob gas consumed by transactions in the block",
            },
            {
              name: "excess_blob_gas",
              type: "INTEGER",
              description:
                "A running total of blob gas consumed in excess of the target, prior to the block. This is used to set blob gas pricing",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "contracts",
        did: "bigquery-public-data.crypto_ethereum.contracts",
        schema: {
          fields: [
            {
              name: "address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the contract",
            },
            {
              name: "bytecode",
              type: "STRING",
              mode: "NULLABLE",
              description: "Bytecode of the contract",
            },
            {
              name: "function_sighashes",
              type: "STRING",
              mode: "REPEATED",
              description: "4-byte function signature hashes",
            },
            {
              name: "is_erc20",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description: "Whether this contract is an ERC20 contract",
            },
            {
              name: "is_erc721",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description: "Whether this contract is an ERC721 contract",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Timestamp of the block where this contract was created",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Block number where this contract was created",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this contract was created",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "load_metadata",
        did: "bigquery-public-data.crypto_ethereum.load_metadata",
        schema: {
          fields: [
            { name: "chain", type: "STRING", mode: "NULLABLE" },
            { name: "load_all_partitions", type: "BOOLEAN", mode: "NULLABLE" },
            { name: "ds", type: "DATE", mode: "NULLABLE" },
            { name: "run_id", type: "STRING", mode: "NULLABLE" },
            { name: "complete_at", type: "TIMESTAMP", mode: "NULLABLE" },
          ],
        },
        type: "TABLE",
      },
      {
        id: "logs",
        did: "bigquery-public-data.crypto_ethereum.logs",
        schema: {
          fields: [
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Integer of the log index position in the block",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transactions this log was created from",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Integer of the transactions index position log was created from",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this log originated",
            },
            {
              name: "data",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Contains one or more 32 Bytes non-indexed arguments of the log",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Indexed log arguments (0 to 4 32-byte hex strings). (In solidity: The first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except you declared the event with the anonymous specifier.)",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description: "Timestamp of the block where this log was in",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The block number where this log was in",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this log was in",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "sessions",
        did: "bigquery-public-data.crypto_ethereum.sessions",
        schema: {
          fields: [
            { name: "id", type: "STRING", mode: "REQUIRED" },
            { name: "start_trace_id", type: "STRING", mode: "REQUIRED" },
            { name: "start_block_number", type: "INTEGER", mode: "REQUIRED" },
            {
              name: "start_block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
            },
            { name: "wallet_address", type: "STRING", mode: "REQUIRED" },
            { name: "contract_address", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "TABLE",
      },
      {
        id: "token_transfers",
        did: "bigquery-public-data.crypto_ethereum.token_transfers",
        schema: {
          fields: [
            {
              name: "token_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "ERC20 token address",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the sender",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the receiver",
            },
            {
              name: "value",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Amount of tokens transferred (ERC20) / id of the token transferred (ERC721). Use safe_cast for casting to NUMERIC or FLOAT64",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Transaction hash",
            },
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Log index in the transaction receipt",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description: "Timestamp of the block where this transfer was in",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Block number where this transfer was in",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this transfer was in",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "tokens",
        did: "bigquery-public-data.crypto_ethereum.tokens",
        schema: {
          fields: [
            {
              name: "address",
              type: "STRING",
              mode: "REQUIRED",
              description: "The address of the ERC20 token",
            },
            {
              name: "symbol",
              type: "STRING",
              mode: "NULLABLE",
              description: "The symbol of the ERC20 token",
            },
            {
              name: "name",
              type: "STRING",
              mode: "NULLABLE",
              description: "The name of the ERC20 token",
            },
            {
              name: "decimals",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "The number of decimals the token uses. Use safe_cast for casting to NUMERIC or FLOAT64",
            },
            {
              name: "total_supply",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "The total token supply. Use safe_cast for casting to NUMERIC or FLOAT64",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Timestamp of the block where this token was created",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Block number where this token was created",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this token was created",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "traces",
        did: "bigquery-public-data.crypto_ethereum.traces",
        schema: {
          fields: [
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Transaction hash where this trace was in",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Integer of the transactions index position in the block",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Address of the sender, null when trace_type is genesis or reward",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Address of the receiver if trace_type is call, address of new contract or null if trace_type is create, beneficiary address if trace_type is suicide, miner address if trace_type is reward, shareholder address if trace_type is genesis, WithdrawDAO address if trace_type is daofork",
            },
            {
              name: "value",
              type: "NUMERIC",
              mode: "NULLABLE",
              description: "Value transferred in Wei",
            },
            {
              name: "input",
              type: "STRING",
              mode: "NULLABLE",
              description: "The data sent along with the message call",
            },
            {
              name: "output",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "The output of the message call, bytecode of contract when trace_type is create",
            },
            {
              name: "trace_type",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "One of call, create, suicide, reward, genesis, daofork",
            },
            {
              name: "call_type",
              type: "STRING",
              mode: "NULLABLE",
              description: "One of call, callcode, delegatecall, staticcall",
            },
            {
              name: "reward_type",
              type: "STRING",
              mode: "NULLABLE",
              description: "One of block, uncle",
            },
            {
              name: "gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Gas provided with the message call",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Gas used by the message call",
            },
            {
              name: "subtraces",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Number of subtraces",
            },
            {
              name: "trace_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Comma separated list of trace address in call tree",
            },
            {
              name: "error",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Error if message call failed. This field doesn't contain top-level trace errors.",
            },
            {
              name: "status",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Either 1 (success) or 0 (failure, due to any operation that can cause the call itself or any top-level call to revert)",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description: "Timestamp of the block where this trace was in",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Block number where this trace was in",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this trace was in",
            },
            {
              name: "trace_id",
              type: "STRING",
              description:
                "Unique string that identifies the trace. For transaction-scoped traces it is {trace_type}_{transaction_hash}_{trace_address}. For block-scoped traces it is {trace_type}_{block_number}_{index_within_block}",
            },
          ],
        },
        type: "TABLE",
      },
      {
        id: "transactions",
        did: "bigquery-public-data.crypto_ethereum.transactions",
        schema: {
          fields: [
            {
              name: "hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction",
            },
            {
              name: "nonce",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "The number of transactions made by the sender prior to this one",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Integer of the transactions index position in the block",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the sender",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Address of the receiver. null when its a contract creation transaction",
            },
            {
              name: "value",
              type: "NUMERIC",
              mode: "NULLABLE",
              description: "Value transferred in Wei",
            },
            {
              name: "gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Gas provided by the sender",
            },
            {
              name: "gas_price",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Gas price provided by the sender in Wei",
            },
            {
              name: "input",
              type: "STRING",
              mode: "NULLABLE",
              description: "The data sent along with the transaction",
            },
            {
              name: "receipt_cumulative_gas_used",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "The total amount of gas used when this transaction was executed in the block",
            },
            {
              name: "receipt_gas_used",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "The amount of gas used by this specific transaction alone",
            },
            {
              name: "receipt_contract_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "The contract address created, if the transaction was a contract creation, otherwise null",
            },
            {
              name: "receipt_root",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "32 bytes of post-transaction stateroot (pre Byzantium)",
            },
            {
              name: "receipt_status",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Either 1 (success) or 0 (failure) (post Byzantium)",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Timestamp of the block where this transaction was in",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Block number where this transaction was in",
            },
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block where this transaction was in",
            },
            {
              name: "max_fee_per_gas",
              type: "INTEGER",
              description: "Total fee that covers both base and priority fees",
            },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              description:
                "Fee given to miners to incentivize them to include the transaction",
            },
            {
              name: "transaction_type",
              type: "INTEGER",
              description: "Transaction type",
            },
            {
              name: "receipt_effective_gas_price",
              type: "INTEGER",
              description:
                "The actual value per gas deducted from the senders account. Replacement of gas_price after EIP-1559",
            },
            {
              name: "max_fee_per_blob_gas",
              type: "INTEGER",
              description:
                "The maximum fee a user is willing to pay per blob gas",
            },
            {
              name: "blob_versioned_hashes",
              type: "STRING",
              mode: "REPEATED",
              description:
                "A list of hashed outputs from kzg_to_versioned_hash",
            },
            {
              name: "receipt_blob_gas_price",
              type: "INTEGER",
              description: "Blob gas price",
            },
            {
              name: "receipt_blob_gas_used",
              type: "INTEGER",
              description: "Blob gas used",
            },
          ],
        },
        type: "TABLE",
      },
    ],

    "Blockchain Analytics Ethereum Mainnet": [
      {
        id: "accounts",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.accounts",
        schema: {
          fields: [
            { name: "address", type: "STRING", mode: "NULLABLE" },
            { name: "code_hash", type: "STRING", mode: "NULLABLE" },
            { name: "code", type: "STRING", mode: "NULLABLE" },
            { name: "is_contract", type: "BOOLEAN", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["address"] },
      },
      {
        id: "accounts_state",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.accounts_state",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block this account state was indexed from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block this account state was indexed from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address identifying the account.",
            },
            {
              name: "nonce",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Nonce (transaction count) associated with this account at this block.",
            },
            {
              name: "balance",
              type: "BIGNUMERIC",
              mode: "REQUIRED",
              description:
                "Native Ether balance of the account in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
            },
            {
              name: "balance_lossless",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Native Ether balance of the account in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
            },
            {
              name: "code_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Hash of the code of the account. For all externally-owned accounts this will be "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470". This is the hash when there is no code present.',
            },
            {
              name: "code",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Compiled bytecode of this account in hexadecimal format, given the account is a smart contract.",
            },
            {
              name: "account_proof",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Merkle proof for verifying the account balance at the given block. An array of RLP-serialized Merkle tree nodes, starting with the state root node.",
            },
            {
              name: "storage_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Hash of the storage root representing a Merkle proof. For all non-smart contract accounts this will be "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421". This is the hash of an empty Merkle tree.',
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "accounts_state_by_address",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.accounts_state_by_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "address", type: "STRING", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "balance", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "balance_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "code_hash", type: "STRING", mode: "NULLABLE" },
            { name: "code", type: "STRING", mode: "NULLABLE" },
            { name: "account_proof", type: "STRING", mode: "REPEATED" },
            { name: "storage_hash", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["address"] },
      },
      {
        id: "blocks",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.blocks",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "parent_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the parent block.",
            },
            {
              name: "size",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Size of this block in bytes.",
            },
            {
              name: "extra_data",
              type: "STRING",
              mode: "REQUIRED",
              description: "Extra data of this block.",
            },
            {
              name: "gas_limit",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Maximum gas allowed in this block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Total gas used by all transactions in this block.",
            },
            {
              name: "base_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Reserve price that transactions must pay for inclusion in this block.",
            },
            {
              name: "mix_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "32-byte hash which proves, when combined with the nonce, that a sufficient amount of computation has been carried out on this block.",
            },
            {
              name: "nonce",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "8-byte integer in hexadecimal format. Used together with the mix hash to show the proof of work.",
            },
            {
              name: "difficulty",
              type: "BIGNUMERIC",
              mode: "NULLABLE",
              description: "Difficulty for this block.",
            },
            {
              name: "total_difficulty",
              type: "BIGNUMERIC",
              mode: "NULLABLE",
              description:
                "Accumulated difficulty of the chain until this block.",
            },
            {
              name: "miner",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Address of the beneficiary to whom the mining rewards were given.",
            },
            {
              name: "sha3_uncles",
              type: "STRING",
              mode: "REQUIRED",
              description: "SHA3 of the uncles data in the block.",
            },
            {
              name: "transaction_count",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of transactions in the block.",
            },
            {
              name: "transactions_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the transaction trie of the block.",
            },
            {
              name: "receipts_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the receipts trie of the block.",
            },
            {
              name: "state_root",
              type: "STRING",
              mode: "REQUIRED",
              description: "Root of the final state trie of the block.",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              mode: "REQUIRED",
              description: "Bloom filter for the logs of the block.",
            },
            {
              name: "withdrawals_root",
              type: "STRING",
              mode: "NULLABLE",
              description: "Validator withdrawal root.",
            },
            {
              name: "withdrawals",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                {
                  name: "index",
                  type: "INTEGER",
                  mode: "REQUIRED",
                  description: "Index of the withdrawal.",
                },
                {
                  name: "validator_index",
                  type: "INTEGER",
                  mode: "REQUIRED",
                  description:
                    "Index of the validator that generated withdrawal.",
                },
                {
                  name: "address",
                  type: "STRING",
                  mode: "REQUIRED",
                  description: "Recipient address for withdrawal value.",
                },
                {
                  name: "amount",
                  type: "BIGNUMERIC",
                  mode: "REQUIRED",
                  description:
                    "Value transferred by the withdrawal in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
                },
                {
                  name: "amount_lossless",
                  type: "STRING",
                  mode: "REQUIRED",
                  description:
                    "Value transferred by the withdrawal in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
                },
              ],
              description: "Validator withdrawals.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "decoded_events",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.decoded_events",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this event was emitted from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this event was emitted from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the transaction this event was emitted from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The event's index position in the block.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this event originated.",
            },
            {
              name: "event_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Keccak hash of the event signature.",
            },
            {
              name: "event_signature",
              type: "STRING",
              mode: "NULLABLE",
              description: "Function signature of the event.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description: "The original indexed topics of the event.",
            },
            {
              name: "args",
              type: "JSON",
              mode: "NULLABLE",
              description:
                "The decoded arguments of the event as a JSON array.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the event was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "logs",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.logs",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this log was created from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this log was created from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction this log was created from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The log's index position in the block.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this log originated.",
            },
            {
              name: "data",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Contains one or more 32-byte non-indexed arguments of the log.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Array of 0 to 4 32-byte hex of indexed log arguments.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the log was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "receipts",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.receipts",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the receiver.",
            },
            {
              name: "contract_address",
              type: "STRING",
              mode: "NULLABLE",
              description:
                "Hexadecimal-encoded address of new contract or absent if no contract was created.",
            },
            {
              name: "cumulative_gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Gas used by this and all preceding transactions in the block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Gas used by this transaction alone.",
            },
            {
              name: "effective_gas_price",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Actual value per gas deducted from the sender's account.",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              mode: "REQUIRED",
              description: "Bloom filter of the logs from this transaction.",
            },
            {
              name: "root",
              type: "STRING",
              mode: "NULLABLE",
              description: "Post-transaction state root.",
            },
            {
              name: "status",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Either 1 (success) or 0 (failure).",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "token_transfers",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.token_transfers",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this event was emitted from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this event was emitted from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the transaction this event was emitted from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "event_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The event's index position in the block.",
            },
            {
              name: "batch_index",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "The transfer's position in the batch transfer event.",
            },
            {
              name: "address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address from which this event originated.",
            },
            {
              name: "event_type",
              type: "STRING",
              mode: "REQUIRED",
              description: "Token standard that matches the event.",
            },
            {
              name: "event_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Keccak hash of the event signature.",
            },
            {
              name: "event_signature",
              type: "STRING",
              mode: "REQUIRED",
              description: "Function signature of the event.",
            },
            {
              name: "operator_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the transfer operator.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the previous owner of the token(s).",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the new owner of the token(s).",
            },
            {
              name: "token_id",
              type: "STRING",
              mode: "NULLABLE",
              description: "Identifier of the token(s) being transferred.",
            },
            {
              name: "quantity",
              type: "STRING",
              mode: "REQUIRED",
              description: "Quantity of tokens being transferred.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              mode: "NULLABLE",
              description:
                "Whether or not the event was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "traces",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.traces",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the block this trace was created from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of the block this trace was created from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "NULLABLE",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "The transaction's index position in the block.",
            },
            {
              name: "trace_type",
              type: "STRING",
              mode: "REQUIRED",
              description:
                'Trace type. One of "create", "suicide", "call" or "reward".',
            },
            {
              name: "trace_address",
              type: "INTEGER",
              mode: "REPEATED",
              description:
                "A sequence of indices that uniquely identifies this trace within the call tree. Available only for transaction-scoped traces.",
            },
            {
              name: "subtrace_count",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Number of subtraces of this trace.",
            },
            {
              name: "action",
              type: "RECORD",
              mode: "REQUIRED",
              fields: [
                {
                  name: "from_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the sender. Null for "suicide" and "reward" traces.',
                },
                {
                  name: "to_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the receiver. Null for "suicide" and "reward" traces.',
                },
                {
                  name: "call_type",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Trace call type. One of "call", "callcode", "staticcall" or "delegatecall". Available only for "call" traces.',
                },
                {
                  name: "gas",
                  type: "INTEGER",
                  mode: "NULLABLE",
                  description: "Amount of gas provided by the sender.",
                },
                {
                  name: "input",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Input sent along with the transaction. Available only for "call" traces.',
                },
                {
                  name: "value",
                  type: "BIGNUMERIC",
                  mode: "NULLABLE",
                  description:
                    'Value transferred by this trace in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision. Available only for "call" traces.',
                },
                {
                  name: "value_lossless",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Value transferred by this trace in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision. Available only for "call" traces.',
                },
                {
                  name: "init",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Input sent along with the transaction that deploys the contract. Available only for "create" traces.',
                },
                {
                  name: "author",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Recipient of the block or uncle reward. Available only for "reward" traces.',
                },
                {
                  name: "reward_type",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Reward type. One of "block" or "uncle". Available only for "reward" traces.',
                },
                {
                  name: "refund_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address to which the remaining balance of a suicided contract was transferred. Value is set only for "suicide" traces.',
                },
                {
                  name: "refund_balance",
                  type: "BIGNUMERIC",
                  mode: "NULLABLE",
                  description:
                    'Refund balance in Wei for a suicided contract. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision. Available only for "suicide" traces.',
                },
                {
                  name: "refund_balance_lossless",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Refund balance in Wei for a suicided contract. A decimal number represented in STRING format to preserve full 256-bit numeric precision. Available only for "suicide" traces.',
                },
                {
                  name: "self_destructed_address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the contract being self-destructed. Available only for "suicide" traces.',
                },
              ],
              description: "Action being carried out by this trace.",
            },
            {
              name: "result",
              type: "RECORD",
              mode: "NULLABLE",
              fields: [
                {
                  name: "gas_used",
                  type: "INTEGER",
                  mode: "NULLABLE",
                  description: "Gas used by this trace alone.",
                },
                {
                  name: "output",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    "Value returned by the contract call. Empty if the RETURN method was not executed.",
                },
                {
                  name: "address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Address of the deployed smart contract. Available only for "create" traces.',
                },
                {
                  name: "code",
                  type: "STRING",
                  mode: "NULLABLE",
                  description:
                    'Code of the deployed smart contract. Available only for "create" traces.',
                },
              ],
              description: "Result of this trace.",
            },
            {
              name: "error",
              type: "STRING",
              mode: "NULLABLE",
              description: "Error message of this trace, if any.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "transactions",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.transactions",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              mode: "REQUIRED",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              mode: "REQUIRED",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "The transaction's index position in the block.",
            },
            {
              name: "nonce",
              type: "INTEGER",
              mode: "REQUIRED",
              description:
                "Number of transactions made by the sender prior to this one.",
            },
            {
              name: "from_address",
              type: "STRING",
              mode: "REQUIRED",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              mode: "NULLABLE",
              description: "Address of the receiver.",
            },
            {
              name: "value",
              type: "BIGNUMERIC",
              mode: "REQUIRED",
              description:
                "Value transferred in Wei. A decimal number represented as a BIGNUMERIC to preserve up to 128-bit numeric precision.",
            },
            {
              name: "value_lossless",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Value transferred in Wei. A decimal number represented in STRING format to preserve full 256-bit numeric precision.",
            },
            {
              name: "gas",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Quantity of gas units provided by the sender.",
            },
            {
              name: "gas_price",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Price per gas unit provided by the sender in Wei.",
            },
            {
              name: "input",
              type: "STRING",
              mode: "REQUIRED",
              description:
                "Data sent along with the transaction, with a maximum size of 32 bytes.",
            },
            {
              name: "max_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Maximum fee per unit of gas for this transaction.",
            },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
              description:
                "Maximum priority fee per unit of gas for this transaction.",
            },
            {
              name: "transaction_type",
              type: "INTEGER",
              mode: "REQUIRED",
              description: "Type of the transaction.",
            },
            {
              name: "chain_id",
              type: "INTEGER",
              mode: "NULLABLE",
              description: "Chain ID used in transaction signing.",
            },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                {
                  name: "address",
                  type: "STRING",
                  mode: "NULLABLE",
                  description: "Smart contract or wallet address.",
                },
                {
                  name: "storage_keys",
                  type: "STRING",
                  mode: "REPEATED",
                  description:
                    "Storage keys for accessing the Merkle tree state.",
                },
              ],
              description:
                "List of addresses and storage keys that the transaction plans to access and has pre-paid gas for.",
            },
            {
              name: "r",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature r.",
            },
            {
              name: "s",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature s.",
            },
            {
              name: "v",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature v.",
            },
            {
              name: "y_parity",
              type: "STRING",
              mode: "NULLABLE",
              description: "ECDSA signature y_parity.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "transactions_by_from_address",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.transactions_by_from_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "transaction_hash", type: "STRING", mode: "NULLABLE" },
            { name: "transaction_index", type: "INTEGER", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "from_address", type: "STRING", mode: "NULLABLE" },
            { name: "to_address", type: "STRING", mode: "NULLABLE" },
            { name: "value", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "value_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "gas", type: "INTEGER", mode: "NULLABLE" },
            { name: "gas_price", type: "INTEGER", mode: "NULLABLE" },
            { name: "input", type: "STRING", mode: "NULLABLE" },
            { name: "max_fee_per_gas", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
            },
            { name: "transaction_type", type: "INTEGER", mode: "NULLABLE" },
            { name: "chain_id", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                { name: "address", type: "STRING", mode: "NULLABLE" },
                { name: "storage_keys", type: "STRING", mode: "REPEATED" },
              ],
            },
            { name: "r", type: "STRING", mode: "NULLABLE" },
            { name: "s", type: "STRING", mode: "NULLABLE" },
            { name: "v", type: "STRING", mode: "NULLABLE" },
            { name: "y_parity", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["from_address"] },
      },
      {
        id: "transactions_by_to_address",
        did: "bigquery-public-data.blockchain_analytics_ethereum_mainnet_us.transactions_by_to_address",
        schema: {
          fields: [
            { name: "block_hash", type: "STRING", mode: "NULLABLE" },
            { name: "block_number", type: "INTEGER", mode: "NULLABLE" },
            { name: "block_timestamp", type: "TIMESTAMP", mode: "NULLABLE" },
            { name: "transaction_hash", type: "STRING", mode: "NULLABLE" },
            { name: "transaction_index", type: "INTEGER", mode: "NULLABLE" },
            { name: "nonce", type: "INTEGER", mode: "NULLABLE" },
            { name: "from_address", type: "STRING", mode: "NULLABLE" },
            { name: "to_address", type: "STRING", mode: "NULLABLE" },
            { name: "value", type: "BIGNUMERIC", mode: "NULLABLE" },
            { name: "value_lossless", type: "STRING", mode: "NULLABLE" },
            { name: "gas", type: "INTEGER", mode: "NULLABLE" },
            { name: "gas_price", type: "INTEGER", mode: "NULLABLE" },
            { name: "input", type: "STRING", mode: "NULLABLE" },
            { name: "max_fee_per_gas", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              mode: "NULLABLE",
            },
            { name: "transaction_type", type: "INTEGER", mode: "NULLABLE" },
            { name: "chain_id", type: "INTEGER", mode: "NULLABLE" },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                { name: "address", type: "STRING", mode: "NULLABLE" },
                { name: "storage_keys", type: "STRING", mode: "REPEATED" },
              ],
            },
            { name: "r", type: "STRING", mode: "NULLABLE" },
            { name: "s", type: "STRING", mode: "NULLABLE" },
            { name: "v", type: "STRING", mode: "NULLABLE" },
            { name: "y_parity", type: "STRING", mode: "NULLABLE" },
          ],
        },
        type: "MATERIALIZED_VIEW",
        clustering: { fields: ["to_address"] },
      },
    ],

    "Ethereum goerli": [
      {
        id: "blocks",
        did: "bigquery-public-data.goog_blockchain_ethereum_goerli_us.blocks",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              description: "Hash of the block.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              description: "Number of the block.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "parent_hash",
              type: "STRING",
              description: "Hash of the parent block.",
            },
            {
              name: "size",
              type: "INTEGER",
              description: "Size of this block in bytes.",
            },
            {
              name: "extra_data",
              type: "STRING",
              description:
                "Extra data of this block. Lowercase hex-encoded string prefixed with 0x.",
            },
            {
              name: "gas_limit",
              type: "INTEGER",
              description: "Maximum gas allowed in this block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              description: "Total gas used by all transactions in this block.",
            },
            {
              name: "base_fee_per_gas",
              type: "INTEGER",
              description:
                "Reserve price that transactions must pay for inclusion in this block.",
            },
            {
              name: "mix_hash",
              type: "STRING",
              description:
                "32-byte hash which proves, when combined with the nonce, that a sufficient amount of computation has been carried out on this block.",
            },
            {
              name: "nonce",
              type: "BIGNUMERIC",
              description:
                "Used together with the mix hash to show the proof of work.",
            },
            {
              name: "difficulty",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "Difficulty for this block.",
            },
            {
              name: "total_difficulty",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description:
                "Accumulated difficulty of the chain until this block.",
            },
            {
              name: "miner",
              type: "STRING",
              description:
                "Address of the beneficiary to whom the mining rewards were given.",
            },
            {
              name: "uncles_sha3",
              type: "STRING",
              description: "SHA3 of the uncles data in the block.",
            },
            {
              name: "uncles",
              type: "STRING",
              mode: "REPEATED",
              description: "Array of uncle hashes.",
            },
            {
              name: "transactions_root",
              type: "STRING",
              description:
                "Root of the transaction trie of the block. Lowercase hex-encoded string prefixed with 0x.",
            },
            {
              name: "receipts_root",
              type: "STRING",
              description: "Root of the receipts trie of the block.",
            },
            {
              name: "state_root",
              type: "STRING",
              description: "Root of the final state trie of the block.",
            },
            {
              name: "logs_bloom",
              type: "STRING",
              description: "Bloom filter for the logs of the block.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "decoded_events",
        did: "bigquery-public-data.goog_blockchain_ethereum_goerli_us.decoded_events",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              description: "Hash of the block this event was emitted on.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              description: "Number of the block this event was emitted on.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              description:
                "Unix timestamp when the block was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              description: "Hash of the transaction this event was emitted on.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              description: "The event's index position in the transaction.",
            },
            {
              name: "address",
              type: "STRING",
              description: "Address from which this event originated.",
            },
            {
              name: "event_hash",
              type: "STRING",
              description: "Keccak hash of the event signature.",
            },
            {
              name: "event_signature",
              type: "STRING",
              description: "The function signature of the event.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description: "The indexed topics of the event.",
            },
            {
              name: "args",
              type: "JSON",
              description:
                "Decoded event arguments serialized as a JSON array.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              description:
                "Whether or not the event was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "logs",
        did: "bigquery-public-data.goog_blockchain_ethereum_goerli_us.logs",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              description: "Hash of the block this log was created from.",
            },
            {
              name: "block_number",
              type: "INTEGER",
              description: "Number of the block this log was created from.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              description:
                "Unix timestamp when the log was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              description: "Hash of the transaction this log was created from.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              description: "The transaction's index position in the block.",
            },
            {
              name: "log_index",
              type: "INTEGER",
              description: "The log's index position in the block.",
            },
            {
              name: "address",
              type: "STRING",
              description: "Address from which this log originated.",
            },
            {
              name: "data",
              type: "STRING",
              description:
                "Contains one or more 32-byte non-indexed arguments of the log.",
            },
            {
              name: "topics",
              type: "STRING",
              mode: "REPEATED",
              description:
                "Array of 0 to 4 32-byte hex of indexed log arguments.",
            },
            {
              name: "removed",
              type: "BOOLEAN",
              description:
                "Whether or not the log was orphaned off the main chain.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "receipts",
        did: "bigquery-public-data.goog_blockchain_ethereum_goerli_us.receipts",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              description:
                "Unix timestamp when the transaction was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              description: "The transaction's index position in the block.",
            },
            {
              name: "from_address",
              type: "STRING",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              description: "Address of the receiver.",
            },
            {
              name: "contract_address",
              type: "STRING",
              description:
                "Hexadecimal-encoded address of new contract or absent if no contract was created.",
            },
            {
              name: "cumulative_gas_used",
              type: "INTEGER",
              description:
                "Gas used by this and all preceding transactions in the block.",
            },
            {
              name: "gas_used",
              type: "INTEGER",
              description: "Gas used by this transaction alone.",
            },
            {
              name: "effective_gas_price",
              type: "INTEGER",
              description:
                "Actual value per gas deducted from the sender's account.",
            },
            {
              name: "root",
              type: "STRING",
              description: "Post-transaction state root.",
            },
            {
              name: "status",
              type: "INTEGER",
              description: "Either 1 (success) or 0 (failure).",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
      {
        id: "transactions",
        did: "bigquery-public-data.goog_blockchain_ethereum_goerli_us.transactions",
        schema: {
          fields: [
            {
              name: "block_hash",
              type: "STRING",
              description:
                "Hash of the block in which this transaction was located.",
            },
            {
              name: "block_timestamp",
              type: "TIMESTAMP",
              description:
                "Unix timestamp when the transaction was added to the blockchain.",
            },
            {
              name: "transaction_hash",
              type: "STRING",
              description: "Hash of the transaction.",
            },
            {
              name: "transaction_index",
              type: "INTEGER",
              description: "The transaction's index position in the block.",
            },
            {
              name: "nonce",
              type: "BIGNUMERIC",
              description:
                "Number of transactions made by the sender prior to this one.",
            },
            {
              name: "from_address",
              type: "STRING",
              description: "Address of the sender.",
            },
            {
              name: "to_address",
              type: "STRING",
              description: "Address of the receiver.",
            },
            {
              name: "value",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "Value transferred in Wei.",
            },
            {
              name: "input",
              type: "STRING",
              description:
                "Data sent along with the transaction, with a maximum size of 32 bytes.",
            },
            {
              name: "gas",
              type: "INTEGER",
              description: "Quantity of gas units provided by the sender.",
            },
            {
              name: "gas_price",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "Price per gas unit provided by the sender in Wei.",
            },
            {
              name: "max_fee_per_gas",
              type: "INTEGER",
              description: "Maximum fee per unit of gas for this transaction.",
            },
            {
              name: "max_priority_fee_per_gas",
              type: "INTEGER",
              description:
                "Maximum priority fee per unit of gas for this transaction.",
            },
            {
              name: "transaction_type",
              type: "INTEGER",
              description: "Type of the transaction.",
            },
            {
              name: "access_list",
              type: "RECORD",
              mode: "REPEATED",
              fields: [
                {
                  name: "address",
                  type: "STRING",
                  description:
                    "Address that a particular transaction will access.",
                },
                {
                  name: "storage_keys",
                  type: "STRING",
                  mode: "REPEATED",
                  description:
                    "List of storage keys a particular transaction will access.",
                },
              ],
              description:
                "List of addresses and storage keys that the transaction plans to access and has pre-paid gas for.",
            },
            {
              name: "r",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "ECDSA signature r.",
            },
            {
              name: "s",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "ECDSA signature s.",
            },
            {
              name: "v",
              type: "RECORD",
              fields: [
                {
                  name: "string_value",
                  type: "STRING",
                  description: "Decimal value stored as a string.",
                },
                {
                  name: "bignumeric_value",
                  type: "BIGNUMERIC",
                  description: "Decimal value stored as a bignumeric.",
                },
              ],
              description: "ECDSA signature v.",
            },
          ],
        },
        type: "TABLE",
        clustering: { fields: ["block_timestamp"] },
      },
    ],
  } as const;
}
