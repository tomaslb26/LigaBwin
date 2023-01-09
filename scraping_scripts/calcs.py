import pandas as pd
import numpy as np
import ast


def changePositions(df):
    ret_df = pd.DataFrame()
    df = df.reset_index()
    df = df.rename(columns={"index": "playerId"})
    players_list = df["playerId"].unique()
    for player_1 in players_list:
        for player_2 in players_list:
            if not ret_df.empty:
                player1_ret_df = ret_df[(ret_df["playerId"] == player_1) & (ret_df["recipient"] == player_2)]
                player2_ret_df = ret_df[(ret_df["playerId"] == player_2) & (ret_df["recipient"] == player_1)]
                if not player1_ret_df.empty or not player2_ret_df.empty:
                    continue
                # player1_ret_dict = player1_ret_df.to_dict('index')
                # player2_ret_dict = player2_ret_df.to_dict('index')
                # if(player1_ret_dict != {} or player2_ret_dict != {}):
                #     continue
            if player_1 == player_2:
                continue
            else:
                player1_df = df[(df["playerId"] == player_1) & (df["recipient"] == player_2)]
                player2_df = df[(df["playerId"] == player_2) & (df["recipient"] == player_1)]
                player1_dict = player1_df.to_dict("index")
                player2_dict = player2_df.to_dict("index")
                if player1_dict == {} or player2_dict == {}:
                    if player1_dict == {} and player2_dict == {}:
                        continue
                    if player1_dict == {}:
                        ret_df = ret_df.append(pd.DataFrame.from_dict(player2_dict, orient="index"), ignore_index=True)
                    if player2_dict == {}:
                        ret_df = ret_df.append(pd.DataFrame.from_dict(player1_dict, orient="index"), ignore_index=True)
                    continue
                if abs(
                    player1_dict[list(player1_dict.keys())[0]]["x"]
                    - player1_dict[list(player1_dict.keys())[0]]["x_end"]
                ) > abs(
                    player1_dict[list(player1_dict.keys())[0]]["y"]
                    - player1_dict[list(player1_dict.keys())[0]]["y_end"]
                ):
                    # player1_dict[list(player1_dict.keys())[0]]['x'] += 0.5
                    player1_dict[list(player1_dict.keys())[0]]["y"] += 0.5
                    # player1_dict[list(player1_dict.keys())[0]]['x_end'] += 0.5
                    player1_dict[list(player1_dict.keys())[0]]["y_end"] += 0.5
                    # player2_dict[list(player2_dict.keys())[0]]['x'] -= 0.5
                    player2_dict[list(player2_dict.keys())[0]]["y"] -= 0.5
                    # player2_dict[list(player2_dict.keys())[0]]['x_end'] -= 0.5
                    player2_dict[list(player2_dict.keys())[0]]["y_end"] -= 0.5
                else:
                    player1_dict[list(player1_dict.keys())[0]]["x"] += 0.5
                    # player1_dict[list(player1_dict.keys())[0]]['y'] += 0.5
                    player1_dict[list(player1_dict.keys())[0]]["x_end"] += 0.5
                    # player1_dict[list(player1_dict.keys())[0]]['y_end'] += 0.5
                    player2_dict[list(player2_dict.keys())[0]]["x"] -= 0.5
                    # player2_dict[list(player2_dict.keys())[0]]['y'] -= 0.5
                    player2_dict[list(player2_dict.keys())[0]]["x_end"] -= 0.5
                    # player2_dict[list(player2_dict.keys())[0]]['y_end'] -= 0.5
            ret_df = ret_df.append(pd.DataFrame.from_dict(player1_dict, orient="index"), ignore_index=True)
            ret_df = ret_df.append(pd.DataFrame.from_dict(player2_dict, orient="index"), ignore_index=True)
    return ret_df


def plot_pass_network(events, teamId):

    df = events[
        [
            "id",
            "eventId",
            "minute",
            "second",
            "teamId",
            "x",
            "y",
            "type",
            "outcomeType",
            "playerId",
            "endX",
            "endY",
            "shirtNo",
            "name",
        ]
    ].copy()

    df = df[df["teamId"] == int(teamId)]
    names = df[["name", "shirtNo", "playerId"]].drop_duplicates().dropna()

    df["passer"] = df["playerId"]
    df["recipient"] = df["playerId"].shift(-1)

    # df.loc[df.type == {'value': 1, 'displayName': 'Pass'},'type'] = "Pass"
    # df.loc[df.outcomeType == {'value': 1, 'displayName': 'Successful'},'outcomeType'] = "Successful"

    passes = df[df["type"] == "Pass"]
    successful = passes[passes["outcomeType"] == "Successful"]

    subs = df[df["type"] == "SubstitutionOff"]
    subs = subs["minute"]
    subs = pd.Series(subs).unique()
    firstSub = subs[0]
    try:
        secondSub = subs[1]
    except:
        secondSub = ''
    # thirdSub = subs[2]

    if firstSub < 22:
        successful = successful[successful["minute"] < secondSub]
        successful = successful[successful["minute"] > firstSub]
        game = str(int(firstSub)) + "' - " + str(int(secondSub)) + "'"
    else:
        successful = successful[successful["minute"] < firstSub]
        game = "0" + "' - " + str(int(firstSub)) + "'"

    pas = pd.to_numeric(successful["passer"], downcast="integer")
    rec = pd.to_numeric(successful["recipient"], downcast="integer")

    successful["passer"] = pas
    successful["recipient"] = rec

    average_locations = successful.groupby("passer").agg({"x": ["mean"], "y": ["mean", "count"]})
    average = average_locations.reset_index()
    average_locations.columns = ["x", "y", "count"]

    average.columns = ["playerId", "x", "y", "count"]
    average["average_location"] = True
    average = average.set_index("playerId").join(names.set_index("playerId"))

    pass_between = successful.groupby(["passer", "recipient"]).id.count().reset_index()
    pass_between.rename({"id": "pass_count"}, axis="columns", inplace=True)

    pass_between = pass_between.merge(average_locations, left_on="passer", right_index=True)
    pass_between = pass_between.merge(average_locations, left_on="recipient", right_index=True, suffixes=["", "_end"])

    pass_between = pass_between.set_index("passer").join(names.set_index("playerId"))

    pass_between = pass_between[pass_between["pass_count"] > 1]

    # pass_iterate['shirtNo'] = pass_iterate['shirtNo'].apply(str)
    pass_between = changePositions(pass_between)

    pass_between["mid_x"] = (pass_between["x"] + pass_between["x_end"]) / 2
    pass_between["mid_y"] = (pass_between["y"] + pass_between["y_end"]) / 2

    pass_between["average_location"] = False

    pass_between = pd.concat([pass_between, average[["name", "shirtNo", "x", "y", "average_location"]]])

    pass_between["game_minutes"] = game

    return pass_between


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
    carries_df["teamId"] = teamId
    carries_df = carries_df.join(names.set_index("playerId"), on="playerId")
    df = pd.concat(
        [
            df,
            carries_df[
                [
                    "playerId",
                    "minute",
                    "second",
                    "teamId",
                    "x",
                    "y",
                    "endX",
                    "endY",
                    "progressive",
                    "type",
                    "name",
                    "shirtNo",
                ]
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

    players_list = df_copy[["name", "playerId", "shirtNo"]]
    df2 = pd.DataFrame(players_list).dropna().drop_duplicates()
    df2.columns = ["name", "playerId", "shirtNo"]

    players_list = df2.to_records(index=False)

    for player, playerId, shirtNo in players_list:

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

        series = pd.Series(
            [player, playerId, shirtNo, min_out - min_started], index=["name", "playerId", "shirtNo", "minutes"]
        )
        df1 = df1.append(series, ignore_index=True)

    return df1


def get_progressive_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[
        (df_copy["type"] == "Pass") & (df_copy["progressive"] == True) & (df_copy["outcomeType"] == "Successful")
    ]

    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(prog_passes=("progressive", "count")).reset_index()

    return ret_df


def get_progressive_carries(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Carry") & (df_copy["progressive"] == True)]

    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(prog_carries=("progressive", "count")).reset_index()

    return ret_df


def get_def_actions(df, team_id):

    def_actions = ["Interception", "BlockedPass", "BallRecovery", "Tackle", "Clearance", "Challenge"]

    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[df_copy["outcomeType"] == "Successful"]

    df_copy["def_action"] = df_copy.apply(lambda row: row["type"] in def_actions, axis=1)
    df_copy = df_copy[df_copy["def_action"] == True]

    ret_df = (
        df_copy.groupby(["name", "playerId", "shirtNo"]).agg(defensive_actions=("def_action", "count")).reset_index()
    )

    return ret_df


def get_take_ons(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "TakeOn") & (df_copy["outcomeType"] == "Successful")]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(suc_take_ons=("type", "count")).reset_index()
    return ret_df


def get_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Pass")]

    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(total_passes=("type", "count")).reset_index()

    return ret_df


def get_successful_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()

    df_copy = df_copy[(df_copy["type"] == "Pass") & (df_copy["outcomeType"] == "Successful")]

    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(suc_passes=("type", "count")).reset_index()

    return ret_df


def get_all_take_ons(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "TakeOn")]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(take_ons=("type", "count")).reset_index()
    return ret_df


def get_xt_per_player(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(xt=("xT", "sum")).reset_index()
    return ret_df


def get_final_third_entries(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "Carry") & (df_copy["endX"] > 70) & (df_copy["x"] < 70)]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(final_third_entries=("type", "count")).reset_index()
    return ret_df


def get_final_third_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[
        (df_copy["type"] == "Pass")
        & (df_copy["endX"] > 70)
        & (df_copy["x"] < 70)
        & (df_copy["outcomeType"] == "Successful")
    ]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(final_third_passes=("type", "count")).reset_index()
    return ret_df


def get_penalty_box_entries(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[(df_copy["type"] == "Carry")]
    df_copy = df_copy[(df_copy["endX"] > 88) & (df_copy["endY"] > 14.5) & (df_copy["endY"] < 54)]
    df_copy = df_copy[((df_copy["x"] < 88) | ((df_copy["x"] > 88) & ((df_copy["y"] < 14.5) | (df_copy["y"] > 54))))]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(penalty_box_entries=("type", "count")).reset_index()
    return ret_df


def get_penalty_box_passes(df, team_id):
    df_copy = df[df["teamId"] == team_id].copy()
    df_copy = df_copy[
        (df_copy["type"] == "Pass")
        & (df_copy["endX"] > 88)
        & (df_copy["endY"] > 14.5)
        & (df_copy["endY"] < 54)
        & (df_copy["outcomeType"] == "Successful")
    ]
    df_copy = df_copy[((df_copy["x"] < 88) | ((df_copy["x"] > 88) & ((df_copy["y"] < 14.5) | (df_copy["y"] > 54))))]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(penalty_box_passes=("type", "count")).reset_index()
    return ret_df


def get_key_passes(df, team_id):
    df_copy = df.copy()
    df_copy["nextType"] = df_copy["type"].shift(-1)
    df_copy = df_copy[
        (df_copy["type"] == "Pass") & (df_copy["outcomeType"] == "Successful") & (df_copy["teamId"] == team_id)
    ]
    df_copy = df_copy[
        (df_copy["nextType"] == "Goal")
        | (df_copy["nextType"] == "ShotOnPost")
        | (df_copy["nextType"] == "MissedShots")
        | (df_copy["nextType"] == "SavedShot")
    ]
    ret_df = df_copy.groupby(["name", "playerId", "shirtNo"]).agg(key_passes=("type", "count")).reset_index()
    return ret_df


def get_statistics(df, team_id, team):

    calcs = pd.read_csv("/home/tomas/Desktop/test/calcs.csv")

    df1 = get_minutes(df, team_id)
    df1 = pd.concat([df1, get_progressive_passes(df, team_id)])
    df1 = pd.concat([df1, get_progressive_carries(df, team_id)])
    df1 = pd.concat([df1, get_def_actions(df, team_id)])
    df1 = pd.concat([df1, get_take_ons(df, team_id)])
    df1 = pd.concat([df1, get_passes(df, team_id)])
    df1 = pd.concat([df1, get_successful_passes(df, team_id)])
    df1 = pd.concat([df1, get_all_take_ons(df, team_id)])
    df1 = pd.concat([df1, get_xt_per_player(df, team_id)])
    df1 = pd.concat([df1, get_final_third_entries(df, team_id)])
    df1 = pd.concat([df1, get_final_third_passes(df, team_id)])
    df1 = pd.concat([df1, get_penalty_box_entries(df, team_id)])
    df1 = pd.concat([df1, get_penalty_box_passes(df, team_id)])
    df1 = pd.concat([df1, get_key_passes(df, team_id)])

    df1["team"] = team

    fotmob_names = calcs[["fotmob_player_id", "shirtNo", "team"]].drop_duplicates().dropna()
    names = (
        pd.concat([calcs[["playerId", "team", "shirtNo"]], df1[["playerId", "team", "shirtNo"]]])
        .drop_duplicates()
        .dropna()
    )

    calcs = calcs.drop(["playerId", "fotmob_player_id"], axis=1)
    df1 = df1.drop(["playerId"], axis=1)

    calcs = (
        pd.concat([calcs, df1])
        .groupby(["shirtNo", "team"])
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
            final_third_entries=("final_third_entries", "sum"),
            final_third_passes=("final_third_passes", "sum"),
            penalty_box_entries=("penalty_box_entries", "sum"),
            penalty_box_passes=("penalty_box_passes", "sum"),
            key_passes=("key_passes", "sum"),
            Goals=("Goals", "sum"),
            Assists=("Assists", "sum"),
            Shots=("Shots", "sum"),
            xG=("xG", "sum"),
            xGOT=("xGOT", "sum"),
            xA=("xA", "sum"),
            ChancesCreated=("ChancesCreated", "sum"),
        )
        .reset_index()
    )

    calcs = pd.merge(calcs, names, how="left", left_on=["team", "shirtNo"], right_on=["team", "shirtNo"])
    calcs = pd.merge(calcs, fotmob_names, how="left", left_on=["team", "shirtNo"], right_on=["team", "shirtNo"])

    calcs.drop_duplicates().to_csv("/home/tomas/Desktop/test/calcs.csv", index=False)


def get_fotmob_stats(result):
    
    try:
        data = result["props"]["pageProps"]["content"]["lineup"]["lineup"]
    except:
        return "error"

    final_df = pd.DataFrame()

    for team in data:
        for player in team["bench"]:
            if player["usualPosition"] == 0:
                continue
            name = player["name"]["firstName"] + " " + player["name"]["lastName"]
            player_id = player["id"]
            shirt_no = player["shirt"]
            try:
                stats = player["stats"][0]["stats"]
            except:
                continue

            player_stats = pd.Series()

            for key in [
                "Goals",
                "Assists",
                "Total shots",
                "Chances created",
                "Expected goals (xG)",
                "Expected goals on target (xGOT)",
                "Expected assists (xA)",
            ]:
                try:
                    player_stats[key] = stats[key]
                except:
                    player_stats[key] = 0

            player_stats["team"] = team["teamName"].replace(" CP", "").replace("FC ", "").replace(" AC", "").replace(" ", "-")
            player_stats["fotmob_name"] = name
            player_stats["fotmob_player_id"] = player_id
            player_stats["shirtNo"] = shirt_no
            final_df = final_df.append(player_stats, ignore_index=True)

        for position in team["players"]:
            for player in position:
                if player["usualPosition"] == 0:
                    continue
                name = player["name"]["firstName"] + " " + player["name"]["lastName"]
                player_id = player["id"]
                shirt_no = player["shirt"]
                try:
                    stats = player["stats"][0]["stats"]
                except:
                    continue

                player_stats = pd.Series()

                for key in [
                    "Goals",
                    "Assists",
                    "Total shots",
                    "Chances created",
                    "Expected goals (xG)",
                    "Expected goals on target (xGOT)",
                    "Expected assists (xA)",
                ]:
                    try:
                        player_stats[key] = stats[key]
                    except:
                        player_stats[key] = 0

                player_stats["team"] = team["teamName"].replace(" CP", "").replace("FC ", "").replace(" AC", "").replace(" ", "-")
                player_stats["fotmob_name"] = name
                player_stats["fotmob_player_id"] = player_id
                player_stats["shirtNo"] = shirt_no
                final_df = final_df.append(player_stats, ignore_index=True)

    final_df["Expected goals (xG)"] = final_df["Expected goals (xG)"].astype(float)
    final_df["Expected goals on target (xGOT)"] = final_df["Expected goals on target (xGOT)"].astype(float)
    final_df["Expected assists (xA)"] = final_df["Expected assists (xA)"].astype(float)
    final_df = final_df.rename(
        columns={
            "Expected goals (xG)": "xG",
            "Expected goals on target (xGOT)": "xGOT",
            "Expected assists (xA)": "xA",
            "Chances created": "ChancesCreated",
            "Total shots": "Shots"
        }
    )

    calcs = pd.read_csv("/home/tomas/Desktop/test/calcs.csv")
    fotmob_names = final_df[["fotmob_player_id", "shirtNo", "team"]].drop_duplicates()

    try:
        names = calcs[["playerId", "shirtNo", "team"]].drop_duplicates().dropna()
        fotmob_names = (
            pd.concat([calcs[["fotmob_player_id", "shirtNo", "team"]], fotmob_names])
            .drop_duplicates()
            .dropna()
        )
    except:
        names = calcs[["playerId", "shirtNo", "team"]].drop_duplicates().dropna()

    fotmob_names["fotmob_player_id"] = fotmob_names["fotmob_player_id"].astype(int)

    final_df = pd.concat([final_df, calcs])

    final_df.drop(["playerId", "fotmob_name", "fotmob_player_id"], axis=1)

    final_df = final_df.fillna(0)
    final_df.replace([np.inf, -np.inf], 0, inplace=True)

    final_df = (
        final_df.groupby(["shirtNo", "team"])
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
            final_third_entries=("final_third_entries", "sum"),
            final_third_passes=("final_third_passes", "sum"),
            penalty_box_entries=("penalty_box_entries", "sum"),
            penalty_box_passes=("penalty_box_passes", "sum"),
            key_passes=("key_passes", "sum"),
            Goals=("Goals", "sum"),
            Assists=("Assists", "sum"),
            Shots=("Shots", "sum"),
            xG=("xG", "sum"),
            xGOT=("xGOT", "sum"),
            xA=("xA", "sum"),
            ChancesCreated=("ChancesCreated", "sum"),
        )
        .reset_index().drop_duplicates()
    )

    final_df = pd.merge(final_df, names, how="left", left_on=["team", "shirtNo"], right_on=["team", "shirtNo"])
    final_df = pd.merge(final_df, fotmob_names, how="left", left_on=["team", "shirtNo"], right_on=["team", "shirtNo"])

    final_df.drop_duplicates().to_csv("/home/tomas/Desktop/test/calcs.csv", index=False)
