export interface Example {
  someTimestamp: Date;
  someName: string;
  someOtherInterface: Example2;
}

export interface Example2 {
  message: string;
}
