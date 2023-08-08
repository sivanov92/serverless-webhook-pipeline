import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {
  Wait,
  Fail,
  Succeed,
  StateMachine,
} from 'aws-cdk-lib/aws-stepfunctions';

export class TransactionProcessingMachine {
  public build(): any {
    //TODO Put state machine definition here and return it
  }

  public createValidatorStep(): any {}
}