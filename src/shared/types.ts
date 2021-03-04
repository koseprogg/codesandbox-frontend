export interface Example {
  someTimestamp: Date;
  someName: String;
  someOtherInterface: Example2;
}

export interface Example2 {
  message: String;
}