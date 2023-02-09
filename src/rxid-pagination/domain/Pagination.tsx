export class Pagination {
  public currentPage: number;
  public firstPage: number;
  public lastPage: number;
  public startPage: number;
  public endPage: number;
  public list: Array<number>;

  public totalRecord: number;
  public perPage: number;
  public size: number;
  private constructor() {}

  public static createEmpty() {
    const pagination = new Pagination();
    pagination.list = [];
    return pagination;
  }
}
