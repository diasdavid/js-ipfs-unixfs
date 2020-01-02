'use strict'

module.exports = `
syntax = "proto2";

message Data {
  enum DataType {
    Raw = 0;
    Directory = 1;
    File = 2;
    Metadata = 3;
    Symlink = 4;
    HAMTShard = 5;
  }

  required DataType Type = 1;
  optional bytes Data = 2;
  optional uint64 filesize = 3;
  repeated uint64 blocksizes = 4;
  optional uint64 hashType = 5;
  optional uint64 fanout = 6;
  optional uint32 mode = 7;
  optional TimeSpec mtime = 8;
}

message TimeSpec {
  required int64 EpochSeconds = 1;
  optional fixed32 EpochNanoseconds = 2;
}

message Metadata {
  optional string MimeType = 1;
}
`
