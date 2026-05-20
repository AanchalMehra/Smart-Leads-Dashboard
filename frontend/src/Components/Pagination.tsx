interface Props {
  page:number;
  totalPages:number;
  setPage:(page:number)=> void;
}

function Pagination({ page, totalPages, setPage }: Props) {
  return (
    <div className="flex justify-center gap-3 mt-4">

      <button
        disabled={page===1}
        onClick={()=>setPage(page - 1)}
        className="px-3 py-1 border disabled:opacity-50"
      >
        Prev
      </button>

      <span>
        {page}/{totalPages}
      </span>

      <button
        disabled={page=== totalPages}
        onClick={()=> setPage(page + 1)}
        className="px-3 py-1 border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination;