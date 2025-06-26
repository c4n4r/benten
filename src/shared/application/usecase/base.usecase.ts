export default abstract class BaseUseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}
