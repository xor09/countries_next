import React,{useEffect} from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import styles from '../styles/Home.module.css'


const API = "https://restcountries.eu/rest/v2/all";

interface Data {
  name: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  flag: string;
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T){
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'capital', numeric: true, disablePadding: false, label: 'Capital' },
  { id: 'region', numeric: true, disablePadding: false, label: 'Region' },
  { id: 'population', numeric: true, disablePadding: false, label: 'Population' },
  { id: 'area', numeric: true, disablePadding: false, label: 'Area' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
         { /*    -------------------------------------------------       */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));


export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('capital');
  const [selected, setSelected] = React.useState<string[]>([]);
  const[rows, setrows] = React.useState<any[]>([]);

  useEffect(() => {
    fetch(API)
      .then(response => response.json())
      .then(response => setrows(response))
    }, []);
  console.log(rows);
    

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) =>n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };



  const [Search, setSearch] = React.useState<string>("");
  const [SearchResult, setSearchResult] = React.useState<any[]>([]);

    useEffect(() => {
    setSearchResult(
      rows.filter((country) => {
        return country.name.toLowerCase().includes(Search.toLowerCase());
      })
    );
  }, [Search, rows]);

  return (
    
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={styles.mainDiv}>
          <div className={styles.formDiv}>
            <input
              id="search-focus"
              type="search"
              // id="form1"
              className={styles.formInputControl}
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div><hr style={{margin: '10px'}}></hr></div>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={SearchResult.length}
            />
            <TableBody>
              {stableSort(SearchResult, getComparator(order, orderBy))
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const flag_url = `${row.flag}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <TableCell padding="checkbox">
                      { /*    -------------------------------------------------       */}
                        <div className={styles.nameFlag}>
                            <img src={flag_url} className={styles.flagImage} />
                            <div></div>
                        </div>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        <b>{row.name}</b>
                      </TableCell>
                      <TableCell align="right">{row.capital}</TableCell>
                      <TableCell align="right">{row.region}</TableCell>
                      <TableCell align="right">{row.population}</TableCell>
                      <TableCell align="right">{row.area}</TableCell>
                    </TableRow>
                  );
                })}
              {/*  */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
