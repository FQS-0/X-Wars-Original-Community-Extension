import {
    Button,
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
import { EFavouriteType } from "~src/lib/json/types/FavouriteType.js"
import { TFavourites } from "~src/lib/json/types/Favourites.js"
import { useAllianceMemberList } from "~src/lib/state/AllianceMemberList.js"

export default function MemberList() {
    const memberList = useAllianceMemberList()

    const downloadJson = () => {
        const coordList: TFavourites = []
        memberList.forEach((member) =>
            member.planets.forEach((planet) => {
                coordList.push({
                    name: member.name,
                    coordinates: planet,
                    type: EFavouriteType.FRIEND,
                })
            })
        )
        const a = window.document.createElement("a")
        const file = new Blob(
            [JSON.stringify({ favourites: coordList }, undefined, 2)],
            {
                type: "application/json",
            }
        )

        a.href = URL.createObjectURL(file)
        a.download = "member.json"
        a.click()
        URL.revokeObjectURL(a.href)
    }

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
                    <TableRow>
                        <TableCell colSpan={5}>
                            <Button onClick={downloadJson}>
                                Download JSON
                            </Button>
                        </TableCell>
                    </TableRow>
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
