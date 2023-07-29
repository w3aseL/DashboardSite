import React, { useState } from "react"
import { Table as ReactstrapTable, Input, ButtonGroup, Button } from "reactstrap"

const Table = props => {
  const { data, rowRender, headers, limitOptions, offset, limit, total, updateOffset, updateLimit, next, previous } = props

  const generatePaginators = (offset, limit, total) => {
    var currentPage = Math.round(offset / limit) + 1
    var pageCount = Math.ceil(total / limit)
    var pages = Array.from({length: pageCount}, (_, i) => i + 1).map(num => ({ pageNumber: num, isActive: currentPage == num }))

    var addStartPad = false, addEndPad = false, startRemoved = 0

    if(currentPage - 2 > 1) {
      startRemoved = currentPage - 4
      pages.splice(currentPage - (currentPage - 1), startRemoved)
      addStartPad = true
    }

    if(currentPage + 2 < pageCount) {
      pages.splice(currentPage + 1 - startRemoved, pageCount - currentPage - 2)
      addEndPad = true
    }

    if (addStartPad) pages = [ ...pages.slice(0, 1), { pageNumber: "..", isActive: true }, ...pages.slice(2) ]
    if (addEndPad) pages = [ ...pages.slice(0, currentPage - startRemoved + 1), { pageNumber: "..", isActive: true }, ...pages.slice(currentPage - startRemoved + 1) ]

    return pages
  }

  return (
    <div className="d-flex flex-column w-100">
      <div id="table-header" className="d-flex flex-row mb-2">
        <div className="d-inline-flex ml-0 mr-auto">
          <p className="m-0 mt-auto mb-auto mr-2">{"Show "}</p>
          <Input type="select" name="limit" value={limit} onChange={updateLimit}>
            {limitOptions.map(l => (
              <option>{l}</option>
            ))}
          </Input>
        </div>
        <div className="ml-auto mr-0 mt-auto mb-auto">
          <ButtonGroup>
            <Button outline size="sm" onClick={previous}>{"<<"}</Button>
            {generatePaginators(offset, limit, total).map(({ pageNumber, isActive }) => (
              <Button outline size="sm" disabled={isActive} onClick={e => updateOffset(e, (pageNumber-1) * limit)}>{pageNumber}</Button>
            ))}
            <Button outline size="sm" onClick={next}>{">>"}</Button>
          </ButtonGroup>
        </div>
      </div>
      <ReactstrapTable>
        <thead>
          <tr>
            {headers.map(header => (
              <th>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => rowRender(d, idx))}
        </tbody>
      </ReactstrapTable>
      <div id="table-footer" className="d-flex flex-row">
        <h5 className="m-0 ml-auto mr-0"><em>Showing {offset+1} to {offset+limit} of {total}.</em></h5>
      </div>
    </div>
  )
}

export { Table }

export default Table