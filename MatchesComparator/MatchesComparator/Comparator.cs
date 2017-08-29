using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MatchesComparator
{
	public static class Comparator
	{
		public static void LongestCommonSubsequence(char[] str1, char[] str2)
		{
			int[,] l = new int[str1.Length, str2.Length];
			int lcs = -1;
			string substr = string.Empty;
			int end = -1;

			for (int i = 0; i < str1.Length; i++)
			{
				for (int j = 0; j < str2.Length; j++)
				{
					if (str1[i] == str2[j])
					{
						if (i == 0 || j == 0)
						{
							l[i, j] = 1;
						}
						else
							l[i, j] = l[i - 1, j - 1] + 1;
						if (l[i, j] > lcs)
						{
							lcs = l[i, j];
							end = i;
						}

					}
					else
						l[i, j] = 0;
				}
			}

			for (int i = end - lcs + 1; i <= end; i++)
			{
				substr += str1[i];
			}

			Console.WriteLine("Longest Common SubString Length = {0}, Longest Common Substring = {1}", lcs, substr);
		}

		public static int LevenshteinDistance(string s, string t)
		{
			int n = s.Length;
			int m = t.Length;
			int[,] d = new int[n + 1, m + 1];

			// Step 1
			//if (n == 0)
			//{
			//	return;
			//}

			//if (m == 0)
			//{
			//	return;
			//}

			// Step 2
			for (int i = 0; i <= n; d[i, 0] = i++)
			{
			}

			for (int j = 0; j <= m; d[0, j] = j++)
			{
			}

			// Step 3
			for (int i = 1; i <= n; i++)
			{
				//Step 4
				for (int j = 1; j <= m; j++)
				{
					// Step 5
					int cost = (t[j - 1] == s[i - 1]) ? 0 : 1;

					// Step 6
					d[i, j] = Math.Min(
						Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
						d[i - 1, j - 1] + cost);
				}
			}
			// Step 7

			Console.WriteLine("LevenshteinDistance = {0}, Str1:{1} ; Str2:{2}", d[n, m], s, t);
			return d[n, m];
		}

		//TODO: dodati umanjivanje ocene u slucajevima:
		//ALT.	ATLETICO	->	ocena -= 5
		//UTD	UNITED		->	ocena -= 3
		public static double LevenshteinDistanceSoft(string nameFromDb, string nameFromFile)
		{
			double cenaZamene = 1;
			int lenFile = nameFromFile.Length;
			int lenDb = nameFromDb.Length;

			double[,] d = new double[lenDb + 1, lenFile + 1];

			for (int i = 0; i < lenDb + 1; i++)
			{
				for (int j = 0; j < lenFile + 1; j++)
				{
					d[i, j] = 0;
				}
			}

			for (int i = 1; i <= lenDb; i++)
			{
				d[i, 0] = i;
			}

			for (int j = 1; j < lenFile + 1; j++)
			{
				d[0, j] = j;
			}

			for (int j = 1; j <= lenFile; j++)
			{
				for (int i = 1; i <= lenDb; i++)
				{
					if (nameFromDb[i - 1] == nameFromFile[j - 1])
					{
						d[i, j] = d[i - 1, j - 1];
					}
					else
					{
						d[i, j] = Math.Min(Math.Min(d[i - 1, j] + cenaZamene,
											d[i, j - 1] + cenaZamene),
											d[i - 1, j - 1] + cenaZamene);
					}
				}
			}

			//Console.WriteLine("LevenshteinDistance = {0}, Str1:{1} ; Str2:{2}", d[lenDb, lenFile], nameFromDb, nameFromFile);
			return d[lenDb, lenFile];
		}

	}
}
