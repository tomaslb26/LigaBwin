import pandas as pd
import numpy as np
import ast


def isProgressivePass(x, y, endX, endY):
    distanceInitial = np.sqrt(np.square(105 - x) + np.square(34 - y))
    distanceFinal = np.sqrt(np.square(105 - endX) + np.square(34 - endY))
    if x <= 52.5 and endX <= 52.5:
        if distanceInitial - distanceFinal > 30:
            return True
    elif x <= 52.5 and endX > 52.5:
        if distanceInitial - distanceFinal > 15:
            return True
    elif x > 52.5 and endX > 52.5:
        if distanceInitial - distanceFinal > 10:
            return True
    return False


def isProgressiveCarry(x, y, endX, endY):
    distanceInitial = np.sqrt(np.square(105 - x) + np.square(34 - y))
    distanceFinal = np.sqrt(np.square(105 - endX) + np.square(34 - endY))
    if x < 52.5 and endX < 52.5 and distanceInitial - distanceFinal > 10:
        return True
    elif x < 52.5 and endX > 52.5 and distanceInitial - distanceFinal > 7.5:
        return True
    elif x > 52.5 and endX > 52.5 and distanceInitial - distanceFinal > 5:
        return True

    return False


def checkCarryPositions(endX, endY, nextX, nextY):
    distance = np.sqrt(np.square(nextX - endX) + np.square(nextY - endY))
    if distance < 1.5:
        return True
    else:
        return False


def get_carries(new_df, teamId):
    df = new_df.copy()
    df["recipient"] = df["playerId"].shift(-1)
    df["nextTeamId"] = df["teamId"].shift(-1)

    a = np.array(
        df[(df["type"] == "Pass") & (df["outcomeType"] == "Successful") & (df["teamId"] == int(teamId))].index.tolist()
    )
    b = np.array(
        df[
            (
                (df["type"] == "BallRecovery")
                | (df["type"] == "Interception")
                | (df["type"] == "Tackle")
                | (df["type"] == "BlockedPass")
            )
            & (df["outcomeType"] == "Successful")
            & (df["teamId"] == int(teamId))
        ].index.tolist()
    )

    carries_df = pd.DataFrame()

    for value in a:
        carry = pd.Series()
        carry["minute"] = df.iloc[value].minute
        carry["second"] = df.iloc[value].second
        carry["playerId"] = df.iloc[value].recipient
        carry["x"] = df.iloc[value].endX
        carry["y"] = df.iloc[value].endY
        if (
            df.iloc[value + 1].type == "OffsideGiven"
            or df.iloc[value + 1].type == "End"
            or df.iloc[value + 1].type == "SubstitutionOff"
            or df.iloc[value + 1].type == "SubstitutionOn"
        ):
            continue
        elif (
            df.iloc[value + 1].type == "Challenge"
            and df.iloc[value + 1].outcomeType == "Unsuccessful"
            and df.iloc[value + 1].teamId != teamId
        ):
            carry["playerId"] = df.iloc[value + 2].playerId
            value += 1
            while (df.iloc[value + 1].type == "TakeOn" and df.iloc[value + 1].outcomeType == "Successful") or (
                df.iloc[value + 1].type == "Challenge" and df.iloc[value + 1].outcomeType == "Unsuccessful"
            ):
                value += 1
            if (
                df.iloc[value + 1].type == "OffsideGiven"
                or df.iloc[value + 1].type == "End"
                or df.iloc[value + 1].type == "SubstitutionOff"
                or df.iloc[value + 1].type == "SubstitutionOn"
            ):
                continue
        if df.iloc[value + 1].teamId != int(teamId):
            continue
        else:
            carry["endX"] = df.iloc[value + 1].x
            carry["endY"] = df.iloc[value + 1].y
        carries_df = carries_df.append(carry, ignore_index=True)

    for value in b:
        carry = pd.Series()
        carry["playerId"] = df.iloc[value].playerId
        carry["minute"] = df.iloc[value].minute
        carry["second"] = df.iloc[value].second
        carry["x"] = df.iloc[value].x
        carry["y"] = df.iloc[value].y
        if (
            df.iloc[value + 1].type == "OffsideGiven"
            or df.iloc[value + 1].type == "End"
            or df.iloc[value + 1].type == "SubstitutionOff"
            or df.iloc[value + 1].type == "SubstitutionOn"
        ):
            continue
        elif (
            df.iloc[value + 1].type == "Challenge"
            and df.iloc[value + 1].outcomeType == "Unsuccessful"
            and df.iloc[value + 1].teamId != teamId
        ):
            carry["playerId"] = df.iloc[value + 2].playerId
            value += 1
            while (df.iloc[value + 1].type == "TakeOn" and df.iloc[value + 1].outcomeType == "Successful") or (
                df.iloc[value + 1].type == "Challenge" and df.iloc[value + 1].outcomeType == "Unsuccessful"
            ):
                value += 1
            if (
                df.iloc[value + 1].type == "OffsideGiven"
                or df.iloc[value + 1].type == "End"
                or df.iloc[value + 1].type == "SubstitutionOff"
                or df.iloc[value + 1].type == "SubstitutionOn"
            ):
                continue
        if df.iloc[value + 1].playerId != df.iloc[value].playerId or df.iloc[value + 1].teamId != int(teamId):
            continue
        carry["endX"] = df.iloc[value + 1].x
        carry["endY"] = df.iloc[value + 1].y
        carries_df = carries_df.append(carry, ignore_index=True)

    carries_df["Removable"] = carries_df.apply(
        lambda row: checkCarryPositions(row["x"], row["y"], row["endX"], row["endY"]), axis=1
    )
    carries_df = carries_df[carries_df["Removable"] == False]
    return carries_df


def get_xt(df):
    xT = pd.read_csv("/home/tomas/Desktop/xT_Grid.csv", header=None)
    xT = np.array(xT)
    xT_rows, xT_cols = xT.shape

    df["x1_bin"] = pd.cut(df["x"], bins=xT_cols, labels=False)
    df["y1_bin"] = pd.cut(df["y"], bins=xT_rows, labels=False)
    df_pass_carry = df[((df["type"] == "Pass") & (df["outcomeType"] == "Successful")) | (df["type"] == "Carry")]
    df = df[((df["type"] == "Pass") & (df["outcomeType"] != "Successful")) | (df["type"] != "Pass")]
    df = df[(df["type"] != "Carry")]
    df_pass_carry["x2_bin"] = pd.cut(df_pass_carry["endX"], bins=xT_cols, labels=False)
    df_pass_carry["y2_bin"] = pd.cut(df_pass_carry["endY"], bins=xT_rows, labels=False)

    df_pass_carry["start_zone_value"] = df_pass_carry[["x1_bin", "y1_bin"]].apply(lambda x: xT[x[1]][x[0]], axis=1)
    df_pass_carry["end_zone_value"] = df_pass_carry[["x2_bin", "y2_bin"]].apply(lambda x: xT[x[1]][x[0]], axis=1)

    df_pass_carry["xT"] = df_pass_carry["end_zone_value"] - df_pass_carry["start_zone_value"]

    df = pd.concat([df, df_pass_carry])

    df = df.drop(["x1_bin", "x2_bin", "y1_bin", "y2_bin", "start_zone_value", "end_zone_value"], axis=1)

    df = df.sort_values(["minute", "second"], ascending=[True, True])

    return df


def clean(x):
    return x["displayName"]


def cleanQualifiers(x):
    newList = []
    for y in x:
        newList += [y["type"]["displayName"]]
    return newList


def fix_types(df2):
    df2["type"] = df2["type"].apply(clean)
    df2["outcomeType"] = df2["outcomeType"].apply(clean)
    df2["qualifiers"] = df2["qualifiers"].apply(cleanQualifiers)
    return df2


def clean_df(df, homeTeam, awayTeam, teamId):
    names = df[["name", "shirtNo", "playerId"]].dropna().drop_duplicates()
    df["x"] = df["x"] * 1.05
    df["y"] = df["y"] * 0.68
    df["endX"] = df["endX"] * 1.05
    df["endY"] = df["endY"] * 0.68
    df["progressive"] = False
    df["progressive"] = df[df["type"] == "Pass"].apply(
        lambda row: isProgressivePass(row.x, row.y, row.endX, row.endY), axis=1
    )
    carries_df = get_carries(df, teamId)
    carries_df["progressive"] = carries_df.apply(
        lambda row: isProgressiveCarry(row.x, row.y, row.endX, row.endY), axis=1
    )
    carries_df["type"] = "Carry"
    carries_df = carries_df.join(names.set_index("playerId"), on="playerId")
    df = pd.concat(
        [
            df,
            carries_df[
                ["playerId", "minute", "second", "x", "y", "endX", "endY", "progressive", "type", "name", "shirtNo"]
            ],
        ]
    )
    df["homeTeam"] = homeTeam
    df["awayTeam"] = awayTeam
    df = df.sort_values(["minute", "second"], ascending=[True, True])
    return df


def get_minutes(df, team_id):

    df1 = pd.DataFrame()

    df_copy = df[df["teamId"] == team_id].copy()

    players_list = df_copy[["name", "playerId"]]
    df2 = pd.DataFrame(players_list).dropna().drop_duplicates()
    df2.columns = ["name", "playerId"]

    players_list = df2.to_records(index=False)

    for player, playerId in players_list:

        new_df = df_copy[(df_copy["type"] == "SubstitutionOn") & (df_copy["name"] == player)]
        min_started = 0
        if len(new_df) != 0:
            if new_df.iloc[0].second > 30:
                min_started = new_df.iloc[0].minute + 1
            else:
                min_started = new_df.iloc[0].minute

        new_df = df_copy[(df_copy["type"] == "SubstitutionOff") & (df_copy["name"] == player)]

        min_out = 90
        if len(new_df) != 0:
            if new_df.iloc[0].second > 30:
                min_out = new_df.iloc[0].minute + 1
            else:
                min_out = new_df.iloc[0].minute

        series = pd.Series([player, playerId, min_out - min_started], index=["name", "playerId", "minutes"])
        df1 = df1.append(series, ignore_index=True)

    return df1


def get_progressive_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[
        (df_copy["type"] == "Pass") & (df_copy["progressive"] == True) & (df_copy["outcomeType"] == "Successful")
    ]

    ret_df = df_copy.groupby(["name", "playerId"]).agg(prog_passes=("progressive", "count")).reset_index()

    return ret_df


def get_progressive_carries(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Carry") & (df_copy["progressive"] == True)]

    ret_df = df_copy.groupby(["name", "playerId"]).agg(prog_carries=("progressive", "count")).reset_index()

    return ret_df


def get_def_actions(df, team_id):

    def_actions = ["Interception", "BlockedPass", "BallRecovery", "Tackle", "Clearance", "Challenge"]

    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[df_copy["outcomeType"] == "Successful"]

    df_copy["def_action"] = df_copy.apply(lambda row: row["type"] in def_actions, axis=1)
    df_copy = df_copy[df_copy["def_action"] == True]

    ret_df = df_copy.groupby(["name", "playerId"]).agg(defensive_actions=("def_action", "count")).reset_index()

    return ret_df


def get_take_ons(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "TakeOn") & (df_copy["outcomeType"] == "Successful")]
    ret_df = df_copy.groupby(["name", "playerId"]).agg(suc_take_ons=("type", "count")).reset_index()
    return ret_df


def get_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Pass")]

    ret_df = df_copy.groupby(["name", "playerId"]).agg(total_passes=("type", "count")).reset_index()

    return ret_df


def get_successful_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Pass") & (df_copy["outcomeType"] == "Successful")]

    ret_df = df_copy.groupby(["name", "playerId"]).agg(suc_passes=("type", "count")).reset_index()

    return ret_df


def get_all_take_ons(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "TakeOn")]
    ret_df = df_copy.groupby(["name", "playerId"]).agg(take_ons=("type", "count")).reset_index()
    return ret_df


def get_xt_per_player(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    ret_df = df_copy.groupby(["name", "playerId"]).agg(xt=("xT", "sum")).reset_index()
    return ret_df


def get_statistics(df, team_id):

    calcs = pd.read_csv("/home/tomas/Desktop/test/calcs.csv")

    calcs.drop(
        [
            "pass_percentage",
            "take_on_percentage",
            "prog_passes_per_90",
            "prog_carries_per_90",
            "def_actions_per_90",
            "take_ons_per_90",
            "xT_per_90",
        ],
        axis=1,
    )

    df1 = get_minutes(df, team_id)
    df1 = pd.concat([df1, get_progressive_passes(df, team_id)])
    df1 = pd.concat([df1, get_progressive_carries(df, team_id)])
    df1 = pd.concat([df1, get_def_actions(df, team_id)])
    df1 = pd.concat([df1, get_take_ons(df, team_id)])
    df1 = pd.concat([df1, get_passes(df, team_id)])
    df1 = pd.concat([df1, get_successful_passes(df, team_id)])
    df1 = pd.concat([df1, get_all_take_ons(df, team_id)])
    df1 = pd.concat([df1, get_xt_per_player(df, team_id)])

    calcs = (
        pd.concat([calcs, df1])
        .groupby(["name", "playerId"])
        .agg(
            minutes=("minutes", "sum"),
            prog_passes=("prog_passes", "sum"),
            prog_carries=("prog_carries", "sum"),
            defensive_actions=("defensive_actions", "sum"),
            suc_take_ons=("suc_take_ons", "sum"),
            total_passes=("total_passes", "sum"),
            suc_passes=("suc_passes", "sum"),
            take_ons=("take_ons", "sum"),
            xt=("xt", "sum"),
        )
        .reset_index()
    )

    calcs["pass_percentage"] = calcs["suc_passes"] / calcs["total_passes"]
    calcs["take_on_percentage"] = calcs["suc_take_ons"] / calcs["take_ons"]
    calcs["prog_passes_per_90"] = (calcs["prog_passes"] * 90) / calcs["minutes"]
    calcs["prog_carries_per_90"] = (calcs["prog_carries"] * 90) / calcs["minutes"]
    calcs["def_actions_per_90"] = (calcs["defensive_actions"] * 90) / calcs["minutes"]
    calcs["take_ons_per_90"] = (calcs["suc_take_ons"] * 90) / calcs["minutes"]
    calcs["xT_per_90"] = (calcs["xt"] * 90) / calcs["minutes"]

    calcs.to_csv("/home/tomas/Desktop/test/calcs.csv", index=False)
