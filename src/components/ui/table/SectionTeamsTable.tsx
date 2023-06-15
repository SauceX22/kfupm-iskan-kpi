import { cn } from "~/lib/utils"
import { Team } from "@prisma/client";
import React from "react";

export type Props = {
    teams?: Team[];
}




// export default function SectionTeamsTable(props: Props) {
//     return (
//         <div className="w-full bg-white card shadow-xl">
//             <div className="card-body">
//                 <section className="card-title text-2xl text-bold">Section 53</section>
//                 <section className="card-subtitle text-sm text-gray-400">Term 231</section>
//             </div>
//             <div className="overflow-x-auto w-full p-3 pt-0">
//                 <table className="table w-full">
//                     {/* head */}
//                     <thead>
//                         <tr>
//                             {/* <th>
//                             <label>
//                                 <input type="checkbox" className="checkbox" />
//                             </label>
//                         </th> */}
//                             <th>Team Name</th>
//                             <th>Evaluation Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {/* row 1 */}
//                         {props.teams && props.teams.map((team) => (
//                             <tr>
//                                 <td>
//                                     <div className="flex items-center space-x-3">
//                                         <div>
//                                             <div className="font-bold">{team.teamName}</div>
//                                             {/* <div className="text-sm opacity-50">United States</div> */}
//                                         </div>
//                                     </div>
//                                 </td>
//                                 <td>
//                                     1/5
//                                     <br />
//                                     {/* <span className="badge badge-ghost badge-sm">Desktop Support Technician</span> */}
//                                 </td>
//                                 <th>
//                                     <button className="btn btn-ghost btn-xs">details</button>
//                                 </th>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }