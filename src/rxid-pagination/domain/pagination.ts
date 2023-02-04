export class Pagination {
  public firstPage: number;
  public lastPage: number;
  public startPage: number;
  public endPage: number;
  public list: Array<number>;
  private constructor() {}

  public static createEmpty(): Pagination {
    const pagination = new Pagination();
    pagination.list = [];
    return pagination;
  }
}
