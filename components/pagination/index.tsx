import React from 'react'
import Pagination from '@material-ui/lab/Pagination';

interface IPropsComponent {
  handleChange: ((event: React.ChangeEvent<unknown>, page: number) => void);
  page: number;
  totalPage: number;
}

export function PaginationComponent({
  handleChange,
  page,
  totalPage
}: IPropsComponent) {
  return (
    <div>
      <Pagination 
        count={totalPage}
        page={page}
        color={'secondary'}
        onChange={handleChange}
      />
    </div>
  )
}