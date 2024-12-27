export interface IUseCase<input, output> {
  execute(input: input): Promise<output>;
}
