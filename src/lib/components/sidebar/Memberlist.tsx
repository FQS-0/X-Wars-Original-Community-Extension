import {
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material"
import { IAllianceMember } from "~src/lib/json/types/AllianceMember.js"
import { useAllianceMemberList } from "~src/lib/state/AllianceMemberList.js"

export default function MemberList() {
    const memberList = useAllianceMemberList()

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Rasse</TableCell>
                        <TableCell>Fraction</TableCell>
                        <TableCell>Punkte</TableCell>
                        <TableCell>Planeten</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {memberList.map((member) => (
                        <Member member={member} key={member.id} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function Member({ member }: { member: IAllianceMember }) {
    return (
        <TableRow>
            <TableCell sx={{ verticalAlign: "top" }}>{member.name}</TableCell>
            <TableCell sx={{ verticalAlign: "top" }}>{member.race}</TableCell>
            <TableCell sx={{ verticalAlign: "top" }}>
                {member.fraction}
            </TableCell>
            <TableCell sx={{ verticalAlign: "top" }} align="right">
                {member.points}
            </TableCell>
            <TableCell>
                <Stack>
                    {member.planets.map((planet) => (
                        <Typography key={planet}>{planet}</Typography>
                    ))}
                </Stack>
            </TableCell>
        </TableRow>
    )
}
